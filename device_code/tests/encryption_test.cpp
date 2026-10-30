#include "../components/esp_tree_common/espnow_crypto.h"
#include "../components/esp_tree_common/espnow_types.h"

#include <cstring>
#include <iostream>

using namespace esphome::esp_tree;

static int failures = 0;

static void expect(bool cond, const char* msg) {
  if (!cond) {
    std::cerr << "FAIL: " << msg << '\n';
    failures++;
  }
}

static void fill_hex(char* out, size_t len, uint8_t value) {
  const char* digits = "0123456789abcdef";
  for (size_t i = 0; i < len; i += 2) {
    out[i] = digits[(value >> 4) & 0x0F];
    out[i + 1] = digits[value & 0x0F];
  }
  out[len] = '\0';
}

static void test_session_tag_wrong_key() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x11);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_JOIN;
  hdr.tx_counter = 50;

  uint8_t payload[16] = {0};
  uint8_t session_key[32] = {0xAA};
  uint8_t session_tag[ESPNOW_SESSION_TAG_LEN]{};
  espnow_crypto_session_tag(session_key, reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), session_tag);

  uint8_t wrong_key[32] = {0xBB};
  expect(espnow_crypto_verify_session_tag(wrong_key, reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), session_tag) == 0,
         "session tag fails with wrong key");
}

static void test_session_tag_tampered_header() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x22);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init 2");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_STATE;
  hdr.tx_counter = 75;

  uint8_t payload[8] = {1, 2, 3, 4, 5, 6, 7, 8};
  uint8_t session_key[32] = {0};
  uint8_t session_tag[ESPNOW_SESSION_TAG_LEN]{};
  espnow_crypto_session_tag(session_key, reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), session_tag);

  espnow_frame_header_t tampered_hdr = hdr;
  tampered_hdr.tx_counter = 76;
  expect(espnow_crypto_verify_session_tag(session_key, reinterpret_cast<const uint8_t*>(&tampered_hdr), payload, sizeof(payload), session_tag) == 0,
         "session tag fails with tampered header");
}

static void test_session_tag_tampered_payload() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x33);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init 3");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_COMMAND;
  hdr.tx_counter = 99;

  uint8_t payload[8] = {1, 2, 3, 4, 5, 6, 7, 8};
  uint8_t session_key[32] = {0};
  uint8_t session_tag[ESPNOW_SESSION_TAG_LEN]{};
  espnow_crypto_session_tag(session_key, reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), session_tag);

  uint8_t tampered_payload[8] = {1, 2, 3, 4, 5, 6, 7, 9};
  expect(espnow_crypto_verify_session_tag(session_key, reinterpret_cast<const uint8_t*>(&hdr), tampered_payload, sizeof(tampered_payload), session_tag) == 0,
         "session tag fails with tampered payload");
}

static void test_session_tag_valid() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x44);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init 4");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_SCHEMA_PUSH;
  hdr.tx_counter = 123;

  uint8_t payload[32] = {0};
  uint8_t session_key[32] = {0};
  uint8_t session_tag[ESPNOW_SESSION_TAG_LEN]{};
  espnow_crypto_session_tag(session_key, reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), session_tag);

  expect(espnow_crypto_verify_session_tag(session_key, reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), session_tag) == 1,
         "session tag valid");
}

static void test_psk_tag_wrong_key() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x55);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init 5");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_DEAUTH;
  hdr.tx_counter = 200;

  uint8_t payload[10] = {0};
  uint8_t psk_tag[ESPNOW_PSK_TAG_LEN]{};
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), psk_tag);

  char wrong_psk_hex[65];
  fill_hex(wrong_psk_hex, 64, 0x66);
  expect(espnow_crypto_init(wrong_psk_hex) == 0, "crypto init wrong psk");
  expect(espnow_crypto_verify_psk_tag(reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), psk_tag) == 0,
         "psk tag fails with wrong psk");
}

static void test_psk_tag_tampered_header() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x77);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init 6");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_HEARTBEAT;
  hdr.tx_counter = 300;

  uint8_t payload[8] = {0};
  uint8_t psk_tag[ESPNOW_PSK_TAG_LEN]{};
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), psk_tag);

  espnow_frame_header_t tampered_hdr = hdr;
  tampered_hdr.packet_type = PKT_STATE;
  expect(espnow_crypto_verify_psk_tag(reinterpret_cast<const uint8_t*>(&tampered_hdr), payload, sizeof(payload), psk_tag) == 0,
         "psk tag fails with tampered header");
}

static void test_psk_tag_valid() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0x88);
  expect(espnow_crypto_init(psk_hex) == 0, "crypto init 7");

  espnow_frame_header_t hdr{};
  hdr.protocol_version = ESPNOW_PROTOCOL_VER;
  hdr.packet_type = PKT_DISCOVER;
  hdr.tx_counter = 400;

  uint8_t payload[49] = {0};
  uint8_t psk_tag[ESPNOW_PSK_TAG_LEN]{};
  espnow_crypto_psk_tag(reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), psk_tag);

  expect(espnow_crypto_verify_psk_tag(reinterpret_cast<const uint8_t*>(&hdr), payload, sizeof(payload), psk_tag) == 1,
         "psk tag valid");
}

static void test_session_key_derivation_deterministic() {
  char psk_hex[65];
  fill_hex(psk_hex, 64, 0xA5);
  expect(espnow_crypto_init(psk_hex) == 0, "directional key init");

  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  for (uint8_t i = 0; i < 16; ++i) {
    bridge_nonce[i] = i;
    remote_nonce[i] = i + 16;
  }

  uint8_t up1[32]{}, down1[32]{}, up2[32]{}, down2[32]{};
  espnow_crypto_derive_session_keys(bridge_nonce, remote_nonce, up1, down1);
  espnow_crypto_derive_session_keys(bridge_nonce, remote_nonce, up2, down2);

  expect(memcmp(up1, up2, 32) == 0, "uplink key deterministic");
  expect(memcmp(down1, down2, 32) == 0, "downlink key deterministic");
  expect(memcmp(up1, down1, 32) != 0, "uplink and downlink keys separated");

  // Independent HKDF-SHA256 reference vectors using PSK=0xA5 repeated,
  // bridge_nonce=00..0f, remote_nonce=10..1f and v3 direction labels.
  const uint8_t expected_up[32] = {
      0xc7,0xd8,0x2d,0xb6,0x59,0x42,0x53,0x53,0x68,0x4a,0x11,0xab,0xf8,0x63,0x90,0x64,
      0xc9,0x5d,0x03,0x4d,0x38,0xed,0x80,0x54,0x84,0xbc,0x09,0x23,0x44,0x01,0xb9,0x83};
  const uint8_t expected_down[32] = {
      0x29,0x21,0x36,0x30,0x4e,0xe7,0x71,0x35,0xb7,0x3d,0xae,0x0f,0xe9,0x16,0x85,0xea,
      0xd3,0xf7,0xe3,0x49,0x1e,0x46,0xe2,0x45,0x86,0x0a,0x6b,0xf4,0x7e,0x40,0x4c,0x06};
  expect(memcmp(up1, expected_up, 32) == 0, "uplink HKDF reference vector");
  expect(memcmp(down1, expected_down, 32) == 0, "downlink HKDF reference vector");
}

static void test_session_key_derivation_different_nonces() {
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  uint8_t up1[32]{}, down1[32]{}, up2[32]{}, down2[32]{};

  espnow_crypto_derive_session_keys(bridge_nonce, remote_nonce, up1, down1);
  remote_nonce[0] = 1;
  espnow_crypto_derive_session_keys(bridge_nonce, remote_nonce, up2, down2);

  expect(memcmp(up1, up2, 32) != 0, "nonce change rotates uplink key");
  expect(memcmp(down1, down2, 32) != 0, "nonce change rotates downlink key");
}

static void test_directional_encryption_and_authentication() {
  uint8_t bridge_nonce[16]{};
  uint8_t remote_nonce[16]{};
  uint8_t up[32]{}, down[32]{};
  espnow_crypto_derive_session_keys(bridge_nonce, remote_nonce, up, down);
  const uint8_t plaintext[] = {0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f,0x10};
  uint8_t up_cipher[sizeof(plaintext)]{}, down_cipher[sizeof(plaintext)]{};
  uint8_t roundtrip[sizeof(plaintext)]{}, retransmission[sizeof(plaintext)]{};
  const uint32_t counter = 42;

  expect(espnow_crypto_crypt(up, counter, plaintext, up_cipher, sizeof(plaintext)) == 0,
         "encrypt uplink");
  expect(espnow_crypto_crypt(down, counter, plaintext, down_cipher, sizeof(plaintext)) == 0,
         "encrypt downlink");
  expect(memcmp(up_cipher, down_cipher, sizeof(plaintext)) != 0,
         "same counter and plaintext produce different ciphertext across directions");
  expect(espnow_crypto_crypt(up, counter, up_cipher, roundtrip, sizeof(plaintext)) == 0 &&
         memcmp(roundtrip, plaintext, sizeof(plaintext)) == 0, "uplink decrypts correctly");
  expect(espnow_crypto_crypt(down, counter, down_cipher, roundtrip, sizeof(plaintext)) == 0 &&
         memcmp(roundtrip, plaintext, sizeof(plaintext)) == 0, "downlink decrypts correctly");
  expect(espnow_crypto_crypt(up, counter, plaintext, retransmission, sizeof(plaintext)) == 0 &&
         memcmp(up_cipher, retransmission, sizeof(plaintext)) == 0,
         "exact retransmission with same key and counter is identical");

  espnow_frame_header_t header{};
  header.protocol_version = ESPNOW_PROTOCOL_VER;
  header.packet_type = PKT_STATE;
  header.tx_counter = counter;
  uint8_t up_tag[ESPNOW_SESSION_TAG_LEN]{};
  espnow_crypto_session_tag(up, reinterpret_cast<const uint8_t*>(&header),
                            up_cipher, sizeof(up_cipher), up_tag);
  expect(espnow_crypto_verify_session_tag(up, reinterpret_cast<const uint8_t*>(&header),
                                          up_cipher, sizeof(up_cipher), up_tag) == 1,
         "correct directional HMAC accepted");
  expect(espnow_crypto_verify_session_tag(down, reinterpret_cast<const uint8_t*>(&header),
                                          up_cipher, sizeof(up_cipher), up_tag) == 0,
         "wrong directional HMAC rejected");
}

static void test_hmac_sha256_consistency() {
  uint8_t key[32] = {0};
  uint8_t data[16] = {0x01, 0x02, 0x03, 0x04};
  uint8_t out1[32] = {};
  uint8_t out2[32] = {};

  espnow_crypto_hmac_sha256(key, 32, data, 4, out1);
  espnow_crypto_hmac_sha256(key, 32, data, 4, out2);

  expect(memcmp(out1, out2, 32) == 0, "hmac-sha256 consistent");
}

static void test_hmac_sha256_different_keys_different_output() {
  uint8_t key1[32] = {0xAA};
  uint8_t key2[32] = {0xBB};
  uint8_t data[8] = {1, 2, 3, 4, 5, 6, 7, 8};
  uint8_t out1[32] = {};
  uint8_t out2[32] = {};

  espnow_crypto_hmac_sha256(key1, 32, data, 8, out1);
  espnow_crypto_hmac_sha256(key2, 32, data, 8, out2);

  expect(memcmp(out1, out2, 32) != 0, "hmac-sha256 different keys different output");
}

static void test_hmac_sha256_empty_data() {
  uint8_t key[32] = {0};
  uint8_t data[1] = {};  // C++17 does not permit a zero-length array.
  uint8_t out[32] = {};
  const uint8_t expected[32] = {
      0xb6,0x13,0x67,0x9a,0x08,0x14,0xd9,0xec,0x77,0x2f,0x95,0xd7,0x78,0xc3,0x5f,0xc5,
      0xff,0x16,0x97,0xc4,0x93,0x71,0x56,0x53,0xc6,0xc7,0x12,0x14,0x42,0x92,0xc5,0xad
  };  // HMAC-SHA256(key=32 zero bytes, message=empty).

  espnow_crypto_hmac_sha256(key, 32, data, 0, out);
  expect(memcmp(out, expected, sizeof(expected)) == 0,
         "hmac-sha256 empty input matches reference digest");
}

static void test_hmac_sha256_output_length() {
  uint8_t key[32] = {0};
  uint8_t data[16] = {0};
  uint8_t out[32] = {};
  const uint8_t expected[32] = {
      0x85,0x3c,0x74,0x03,0x93,0x7d,0x8b,0x62,0x39,0x56,0x9b,0x18,0x4e,0xb7,0x99,0x3f,
      0xc5,0xf7,0x51,0xae,0xfc,0xea,0x28,0xf2,0xc8,0x63,0x85,0x8e,0x2d,0x29,0xc5,0x0b
  };  // HMAC-SHA256(key=32 zero bytes, message=16 zero bytes).

  espnow_crypto_hmac_sha256(key, 32, data, 16, out);
  expect(memcmp(out, expected, sizeof(expected)) == 0,
         "hmac-sha256 full 32-byte output matches reference digest");
}

static void test_hmac_sha256_different_data_different_output() {
  uint8_t key[32] = {0};
  uint8_t data1[8] = {1, 2, 3, 4, 5, 6, 7, 8};
  uint8_t data2[8] = {1, 2, 3, 4, 5, 6, 7, 9};
  uint8_t out1[32] = {};
  uint8_t out2[32] = {};

  espnow_crypto_hmac_sha256(key, 32, data1, 8, out1);
  espnow_crypto_hmac_sha256(key, 32, data2, 8, out2);

  expect(memcmp(out1, out2, 32) != 0, "hmac-sha256 different data different output");
}

int main() {
  test_session_tag_wrong_key();
  test_session_tag_tampered_header();
  test_session_tag_tampered_payload();
  test_session_tag_valid();
  test_psk_tag_wrong_key();
  test_psk_tag_tampered_header();
  test_psk_tag_valid();
  test_session_key_derivation_deterministic();
  test_session_key_derivation_different_nonces();
  test_directional_encryption_and_authentication();

  test_hmac_sha256_consistency();
  test_hmac_sha256_different_keys_different_output();
  test_hmac_sha256_empty_data();
  test_hmac_sha256_output_length();
  test_hmac_sha256_different_data_different_output();

  return failures == 0 ? 0 : 1;
}