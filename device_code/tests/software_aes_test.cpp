// Exercises the AES-256-CTR implementation that runs on the ESP32/ESP8266
// nodes (espnow_crypto.cpp aes256_*), not the OpenSSL fallback the host build
// normally compiles. The target is compiled with
// -DESPNOW_CRYPTO_SOFTWARE_AES so espnow_crypto_crypt() takes the software
// branch.
//
// The expected outputs are known-answer vectors produced independently with
// `openssl enc -aes-256-ctr`, using the same nonce layout the firmware uses
// (32-bit frame counter little-endian in bytes 0..3, then the 128-bit block
// incremented from the last byte). This file does not call OpenSSL itself, so
// the vectors stay valid even if the host library changes.
#include "../components/esp_tree_common/espnow_crypto.h"

#include <cstdint>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <vector>

namespace {

int g_failures = 0;

void expect(bool condition, const char *message) {
  if (!condition) {
    std::cerr << "FAIL: " << message << '\n';
    ++g_failures;
  }
}

bool hex_to_bytes(const char *hex, uint8_t *out, size_t out_len) {
  if (std::strlen(hex) != out_len * 2) return false;
  for (size_t i = 0; i < out_len; ++i) {
    unsigned value = 0;
    if (std::sscanf(hex + i * 2, "%2x", &value) != 1) return false;
    out[i] = static_cast<uint8_t>(value);
  }
  return true;
}

std::vector<uint8_t> hex_string_to_vector(const char *hex) {
  const size_t chars = std::strlen(hex);
  if ((chars % 2) != 0) return {};
  std::vector<uint8_t> out(chars / 2);
  for (size_t i = 0; i < out.size(); ++i) {
    unsigned value = 0;
    if (std::sscanf(hex + i * 2, "%2x", &value) != 1) return {};
    out[i] = static_cast<uint8_t>(value);
  }
  return out;
}

std::vector<uint8_t> software_crypt(const uint8_t key[32], uint32_t tx_counter, const std::vector<uint8_t> &in) {
  std::vector<uint8_t> out(in.size());
  if (espnow_crypto_crypt(key, tx_counter, in.empty() ? nullptr : in.data(), out.data(), in.size()) != 0) {
    return {};
  }
  return out;
}

// NIST SP 800-38A F.5.5 AES-256 key and the first 64 bytes of its plaintext.
// Counter 0xf3f2f1f0 makes bytes 0..3 spell f0 f1 f2 f3, i.e. the first word of
// the F.5.5 initial counter block; the remaining 12 bytes are zero in our
// layout. Expected output from:
//   openssl enc -aes-256-ctr -K <key> -iv f0f1f2f3000000000000000000000000
constexpr const char *kNistKey = "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4";
constexpr const char *kNistPlaintext =
    "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51"
    "30c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710";
constexpr const char *kNistCiphertext =
    "2e9dc37dadf0bc59805502f0a17c1c757e892e8f02f3d265a58f4270d7c89b29"
    "eed500c8c3b4a24e92b15d958984a0be2810fe1bf6625b0b81e4c3cb8cf80b9f";

// Deterministic key (byte i = i*7+3) and plaintext (byte i = (i*31+counter)&0xFF).
constexpr const char *kPatternKey = "030a11181f262d343b424950575e656c737a81888f969da4abb2b9c0c7ced5dc";

// counter 0x12345678, 17 bytes: one full block plus one byte, so the second
// block's counter increment is covered.
constexpr const char *kShortPlaintext = "7897b6d5f4133251708faecdec0b2a4968";
constexpr const char *kShortCiphertext = "cd65897e6d948d5fb4b229e42d222e8fa2";

// counter 0xFFFFFFFF, 300 bytes: many blocks (and a counter whose low byte is
// 0xFF, which exercises the carry into the following bytes).
constexpr const char *kLongCiphertext =
    "b93d215fa629dbb8f6ba297ed4b3dd0162cd077081150ae489ea11519ad452ef"
    "4177343481dd87346c0803b38bcb3bb87e00a2f99b806acc76cd22397a53055a"
    "aefd579e844137a860f71cce05da015c1da8500f00c391e75a3d4b4220d6031f"
    "ea0bf00c1fa64579d3360b1075b1defe85d5433cb18356a2bdb6cec7199fc991"
    "7fdff878513c8719f1bd945765ad03121c5f4479774c34a874f61febd3b85cc2"
    "5260193ac955b5d64df3b5015a80ee40d6c52d50b2c85c94bc08fecba6062ffb"
    "e2060f1014b042abf89e1f9e054f75b1ca96813cf814edd4dce53710076fb745"
    "489fb6f125052096448038ed0faece298b29b4c7ed4e6e00ec759aad5e8d8f76"
    "1fca88e031aaa599671946de70c0e230e8e71bcf3b9434e65ee6e3a03efdc5c7"
    "632c80bc02eed1af578951e0";

void test_nist_known_answer() {
  uint8_t key[32]{};
  expect(hex_to_bytes(kNistKey, key, sizeof(key)), "NIST key parses");
  const std::vector<uint8_t> plaintext = hex_string_to_vector(kNistPlaintext);
  const std::vector<uint8_t> expected = hex_string_to_vector(kNistCiphertext);
  expect(plaintext.size() == 64 && expected.size() == 64, "vector lengths");

  const std::vector<uint8_t> got = software_crypt(key, 0xf3f2f1f0u, plaintext);
  expect(got.size() == expected.size(), "known-answer output length");
  expect(got == expected, "software AES-CTR matches the NIST-derived vector");
}

void test_block_boundary_vectors() {
  uint8_t key[32]{};
  expect(hex_to_bytes(kPatternKey, key, sizeof(key)), "pattern key parses");

  std::vector<uint8_t> short_plaintext(17);
  for (size_t i = 0; i < short_plaintext.size(); ++i) {
    short_plaintext[i] = static_cast<uint8_t>((i * 31 + 0x12345678) & 0xFF);
  }
  const std::vector<uint8_t> expected_short = hex_string_to_vector(kShortCiphertext);
  expect(expected_short.size() == 17, "short vector length");
  expect(software_crypt(key, 0x12345678u, short_plaintext) == expected_short,
         "17-byte output matches the reference (block increment)");

  std::vector<uint8_t> long_plaintext(300);
  for (size_t i = 0; i < long_plaintext.size(); ++i) {
    long_plaintext[i] = static_cast<uint8_t>((i * 31 + 0xFFFFFFFF) & 0xFF);
  }
  const std::vector<uint8_t> expected_long = hex_string_to_vector(kLongCiphertext);
  expect(expected_long.size() == 300, "long vector length");
  expect(software_crypt(key, 0xFFFFFFFFu, long_plaintext) == expected_long,
         "300-byte output matches the reference (counter carry, max frame size)");
}

void test_round_trip_and_counter_separation() {
  uint8_t key[32]{};
  for (size_t i = 0; i < sizeof(key); ++i) key[i] = static_cast<uint8_t>(0xA5 ^ (i * 13));

  std::vector<uint8_t> plaintext(221);
  for (size_t i = 0; i < plaintext.size(); ++i) plaintext[i] = static_cast<uint8_t>(i);

  const std::vector<uint8_t> ciphertext = software_crypt(key, 4242u, plaintext);
  expect(ciphertext.size() == plaintext.size(), "ciphertext length equals plaintext length");
  expect(software_crypt(key, 4242u, ciphertext) == plaintext, "CTR round trip recovers the plaintext");
  expect(ciphertext != plaintext, "ciphertext differs from plaintext");
  expect(software_crypt(key, 4243u, plaintext) != ciphertext,
         "a different frame counter yields a different keystream");
}

}  // namespace

int main() {
  // espnow_crypto_crypt() refuses to run before the PSK is set (it gates on
  // module state); the key passed to it is what matters here.
  expect(espnow_crypto_init("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f") == 0,
         "crypto init with a 64-hex PSK");

  test_nist_known_answer();
  test_block_boundary_vectors();
  test_round_trip_and_counter_separation();

  if (g_failures != 0) {
    std::cerr << g_failures << " software_aes test(s) failed\n";
    return 1;
  }
  std::cout << "software_aes tests passed\n";
  return 0;
}
