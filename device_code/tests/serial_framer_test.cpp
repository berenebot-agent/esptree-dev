// Host tests for the bridge's serial frame accumulator (bridge_serial_framer.h).
//
// Regression: when the RX buffer filled without a 0x00, the old loop stopped
// appending bytes *including the delimiters*, so the buffer never drained and the
// bridge stayed deaf until reboot. The accumulator must resynchronise on the next
// delimiter and keep decoding valid frames afterwards.
#include <cstdint>
#include <iostream>
#include <vector>
#include "../components/esp_tree_bridge/bridge_serial_framer.h"
#include "../components/esp_tree_common/cobs_codec.h"

using esphome::esp_tree::bridge_api::SerialFrameAccumulator;

static int failures = 0;

static void expect(bool cond, const char *msg) {
  if (!cond) {
    std::cerr << "FAIL: " << msg << '\n';
    failures++;
  }
}

static std::vector<std::vector<uint8_t>> feed(SerialFrameAccumulator &acc, const std::vector<uint8_t> &bytes) {
  std::vector<std::vector<uint8_t>> frames;
  std::vector<uint8_t> frame;
  for (uint8_t b : bytes) {
    if (acc.push(b, frame)) frames.push_back(frame);
  }
  return frames;
}

static std::vector<uint8_t> encode_frame(const std::vector<uint8_t> &payload) {
  std::vector<uint8_t> out(payload.size() + payload.size() / 254 + 3);
  out.resize(esphome::esp_tree::cobs_encode(payload.data(), payload.size(), out.data()));
  out.push_back(0x00);
  return out;
}

static void test_splits_on_delimiter_and_skips_empty() {
  SerialFrameAccumulator acc(64);
  auto frames = feed(acc, {0x00, 0x00, 0x01, 0x02, 0x00, 0x03, 0x00});
  expect(frames.size() == 2, "two non-empty frames expected");
  expect(frames.size() == 2 && frames[0] == std::vector<uint8_t>({0x01, 0x02}), "first frame bytes");
  expect(frames.size() == 2 && frames[1] == std::vector<uint8_t>({0x03}), "second frame bytes");
  expect(acc.dropped() == 0, "nothing dropped");
}

static void test_partial_frame_survives_across_reads() {
  SerialFrameAccumulator acc(64);
  expect(feed(acc, {0x05, 0x06}).empty(), "no frame before delimiter");
  auto frames = feed(acc, {0x07, 0x00});
  expect(frames.size() == 1 && frames[0] == std::vector<uint8_t>({0x05, 0x06, 0x07}), "frame spans reads");
}

static void test_overflow_resyncs_and_next_frame_decodes() {
  SerialFrameAccumulator acc(16);
  std::vector<uint8_t> junk(200, 0x41);  // e.g. log text / noise with no 0x00
  expect(feed(acc, junk).empty(), "junk yields no frame");
  expect(acc.discarding(), "accumulator should be discarding after overflow");
  expect(acc.overflows() == 1, "one overflow recorded");

  // The junk's own terminator ends the discard; the next frame must decode.
  std::vector<uint8_t> stream = {0x00};
  const std::vector<uint8_t> payload = {0x10, 0x00, 0x20};
  auto encoded = encode_frame(payload);
  stream.insert(stream.end(), encoded.begin(), encoded.end());
  auto frames = feed(acc, stream);
  expect(frames.size() == 1, "valid frame after overflow must be delivered");
  if (frames.size() == 1) {
    std::vector<uint8_t> decoded(frames[0].size());
    size_t len = 0;
    bool ok = esphome::esp_tree::cobs_decode(frames[0].data(), frames[0].size(), decoded.data(), len);
    decoded.resize(len);
    expect(ok && decoded == payload, "frame after overflow decodes to the sent payload");
  }
  expect(!acc.discarding(), "discard cleared after delimiter");
  expect(acc.dropped() >= 200, "dropped bytes counted");
}

static void test_overflow_discards_tail_of_oversized_frame() {
  // A frame too large for the buffer must not be delivered as a truncated frame.
  SerialFrameAccumulator acc(8);
  std::vector<uint8_t> big(20, 0x55);
  big.push_back(0x00);
  big.push_back(0x09);
  big.push_back(0x00);
  auto frames = feed(acc, big);
  expect(frames.size() == 1 && frames[0] == std::vector<uint8_t>({0x09}), "only the following frame survives");
}

static void test_clear_resets_state() {
  SerialFrameAccumulator acc(4);
  feed(acc, std::vector<uint8_t>(10, 0x01));
  acc.clear();
  expect(!acc.discarding() && acc.buffered() == 0, "clear resets buffer and discard flag");
  auto frames = feed(acc, {0x02, 0x00});
  expect(frames.size() == 1, "frame decodes after clear");
}

int main() {
  test_splits_on_delimiter_and_skips_empty();
  test_partial_frame_survives_across_reads();
  test_overflow_resyncs_and_next_frame_decodes();
  test_overflow_discards_tail_of_oversized_frame();
  test_clear_resets_state();
  if (failures) {
    std::cerr << failures << " failure(s)\n";
    return 1;
  }
  std::cout << "serial_framer_test: all passed\n";
  return 0;
}
