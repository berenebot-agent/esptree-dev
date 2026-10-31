// Host-side self-test for the ESPHome compatibility shim and the COBS codec.
//
// These are the only parts of the native serial bridge that can be exercised
// without ESP-IDF and without hardware: cJSON-backed JSON parsing (which the
// command handlers rely on) and the framing codec the UART stream depends on.
// Everything else needs a real target build.
//
// Build and run with ./run_host_tests.sh.

#include <cstdint>
#include <cstdio>
#include <cstring>
#include <random>
#include <string>
#include <vector>

#include "cJSON.h"
#include "esphome/components/json/json_util.h"
#include "esp_tree_common/cobs_codec.h"

namespace {

int g_failures = 0;
int g_checks = 0;

void check(bool condition, const std::string &what) {
  ++g_checks;
  if (!condition) {
    ++g_failures;
    std::printf("FAIL  %s\n", what.c_str());
  }
}

std::vector<uint8_t> encode(const std::vector<uint8_t> &data) {
  std::vector<uint8_t> out(data.size() * 2 + 8);
  const size_t len = esphome::esp_tree::cobs_encode(data.data(), data.size(), out.data());
  out.resize(len);
  return out;
}

bool round_trip(const std::vector<uint8_t> &data) {
  const std::vector<uint8_t> encoded = encode(data);
  for (uint8_t byte : encoded) {
    if (byte == 0x00) return false;  // COBS output must not contain the delimiter
  }
  std::vector<uint8_t> decoded(data.size() + 8);
  size_t decoded_len = 0;
  if (!esphome::esp_tree::cobs_decode(encoded.data(), encoded.size(), decoded.data(), decoded_len)) {
    return false;
  }
  decoded.resize(decoded_len);
  return decoded == data;
}

void test_cobs() {
  check(round_trip({}), "cobs: empty payload round-trips");
  check(round_trip({0x00}), "cobs: single zero byte round-trips");
  check(round_trip({0x00, 0x00, 0x00}), "cobs: repeated zeros round-trip");

  // Payload sizes that straddle the 254-byte COBS block boundary.
  for (size_t len : {1u, 254u, 255u, 256u, 508u, 509u, 510u, 1024u, 2048u}) {
    std::vector<uint8_t> data(len);
    for (size_t i = 0; i < len; ++i) data[i] = static_cast<uint8_t>(i * 7 + 3);
    check(round_trip(data), "cobs: " + std::to_string(len) + " non-zero bytes round-trip");

    std::vector<uint8_t> zeroed(len, 0x00);
    check(round_trip(zeroed), "cobs: " + std::to_string(len) + " zero bytes round-trip");
  }

  // Random traffic including embedded zeros, which is what a protobuf frame is.
  std::mt19937 rng(1234);
  std::uniform_int_distribution<int> dist(0, 255);
  for (int iteration = 0; iteration < 64; ++iteration) {
    std::vector<uint8_t> data(static_cast<size_t>(iteration * 13 % 600) + 1);
    for (auto &byte : data) byte = static_cast<uint8_t>(dist(rng));
    check(round_trip(data), "cobs: random payload " + std::to_string(iteration) + " round-trips");
  }

  // A frame consisting only of the delimiter byte must not decode into data:
  // the decoder rejects a malformed (zero-length) block.
  uint8_t out[16];
  size_t out_len = 0;
  check(!esphome::esp_tree::cobs_decode(nullptr, 0, out, out_len) || out_len == 0,
        "cobs: empty input decodes to empty output");
}

uint8_t g_last_state = 0xFF;
uint8_t g_last_speed = 0xFF;
bool g_saw_oscillating = false;
bool g_saw_reverse = false;

// Mirrors the fan command parser in esp_tree_bridge.cpp: only an integral
// speed_level may be accepted, and a missing/typed-wrong field must not write.
bool parse_fan_command(const std::string &payload) {
  g_last_state = 0xFF;
  g_last_speed = 0xFF;
  g_saw_oscillating = false;
  g_saw_reverse = false;
  return esphome::json::parse_json(payload, [](esphome::JsonObject root) -> bool {
    bool ok = false;
    if (root["state"].is<const char *>()) {
      g_last_state = root["state"].as<std::string>() == "ON" ? 1 : 0;
      ok = true;
    }
    if (root["speed_level"].is<int>()) {
      g_last_speed = static_cast<uint8_t>(root["speed_level"].as<int>());
      ok = true;
    }
    if (root["oscillating"].is<bool>()) {
      g_saw_oscillating = root["oscillating"].as<bool>();
      ok = true;
    }
    if (root["direction"].is<const char *>()) {
      g_saw_reverse = root["direction"].as<std::string>() == "reverse";
      ok = true;
    }
    return ok;
  });
}

void test_json() {
  using esphome::JsonObject;
  using esphome::json::parse_json;

  // Strings, integers and bools behave as the production parsers expect.
  check(parse_fan_command(R"({"state":"ON","speed_level":2,"oscillating":true})"),
        "json: full fan command parses");
  check(g_last_state == 1, "json: state ON maps to 1");
  check(g_last_speed == 2, "json: integral speed_level accepted");
  check(g_saw_oscillating, "json: bool oscillating accepted");

  parse_fan_command(R"({"state":"OFF","direction":"reverse"})");
  check(g_last_state == 0, "json: state OFF maps to 0");
  check(g_saw_reverse, "json: direction reverse detected");

  // A float is not an integer in ESPHome's variant, so it must be rejected
  // rather than silently truncated.
  check(!parse_fan_command(R"({"speed_level":2.5})"),
        "json: fractional speed_level is rejected, not truncated");
  check(g_last_speed == 0xFF, "json: rejected speed_level leaves the field unset");

  check(!parse_fan_command(R"({"oscillating":1})"),
        "json: numeric 1 is not a bool");
  check(!parse_fan_command(R"({"state":true})"),
        "json: bool is not a string");
  check(!parse_fan_command(R"({"speed_level":"2"})"),
        "json: string is not an integer");

  // Unknown keys must not satisfy the parser.
  check(!parse_fan_command(R"({"brightness":10})"),
        "json: unrelated keys do not report success");

  // Malformed and non-object roots are rejected without touching the handler.
  check(!parse_fan_command("{not json}"), "json: malformed payload rejected");
  check(!parse_fan_command("[1,2,3]"), "json: array root rejected");
  check(!parse_fan_command("null"), "json: null root rejected");
  check(!parse_fan_command(""), "json: empty payload rejected");

  // Nested objects are reachable, as the light colour parser needs.
  bool saw_colour = false;
  uint8_t red = 0, green = 0, blue = 0;
  const bool parsed = parse_json(R"({"color":{"r":11,"g":22,"b":33}})",
                                 [&](JsonObject root) -> bool {
                                   if (!root["color"].is<JsonObject>()) return false;
                                   JsonObject colour = root["color"].as<JsonObject>();
                                   if (!colour["r"].is<int>()) return false;
                                   red = static_cast<uint8_t>(colour["r"].as<int>());
                                   green = static_cast<uint8_t>(colour["g"].as<int>());
                                   blue = static_cast<uint8_t>(colour["b"].as<int>());
                                   saw_colour = true;
                                   return true;
                                 });
  check(parsed && saw_colour, "json: nested colour object parses");
  check(red == 11 && green == 22 && blue == 33, "json: nested colour channels read back");

  // Missing keys yield defaults instead of crashing.
  bool saw_key = true;
  parse_json(R"({"other":1})", [&saw_key](JsonObject root) -> bool {
    saw_key = root["speed_level"].is<int>();
    return true;
  });
  check(!saw_key, "json: missing key reports absent");
}

}  // namespace

int main() {
  test_cobs();
  test_json();
  std::printf("%d checks, %d failure(s)\n", g_checks, g_failures);
  return g_failures == 0 ? 0 : 1;
}
