// Drives BridgeProtocol::on_espnow_frame with real DISCOVER frames to pin the
// session-table contract:
//   * at most MAX_SESSIONS nodes are remembered, and node MAX_SESSIONS+1 is
//     refused (bridge_protocol.cpp ensure_session_);
//   * a node that already has a session is still served while the table is full;
//   * the low-RAM eviction walks a full table without touching memory outside
//     its buffers, and leaves room for a new node.
//
// The bug this guards: ensure_session_ used to insert unconditionally while
// evict_sessions_for_ram_ filled a fixed MAX_SESSIONS-entry array from the map,
// so a 129th session wrote past the end of that array.
#include "../components/esp_tree_bridge/bridge_protocol.h"

#include "mocks/test_time.h"

#include "../components/esp_tree_common/espnow_crypto.h"

#include <array>
#include <cstdint>
#include <cstring>
#include <iostream>
#include <vector>

using namespace esphome::esp_tree;

namespace {

int g_failures = 0;

void expect(bool condition, const char *message) {
  if (!condition) {
    std::cerr << "FAIL: " << message << '\n';
    ++g_failures;
  }
}

constexpr const char *kPsk = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
constexpr const char *kNetworkId = "session-cap-net";

std::array<uint8_t, 6> mac_for(uint32_t index) {
  // Distinct, non-broadcast, deterministic MACs.
  return {0x02, 0x00, 0x00, 0x00, static_cast<uint8_t>((index >> 8) & 0xFF), static_cast<uint8_t>(index & 0xFF)};
}

// A DISCOVER frame the way a leaf emits it: header + payload, with a valid PSK
// tag. DISCOVER is not an encrypted packet, so there is no session tag.
std::vector<uint8_t> make_discover(const std::array<uint8_t, 6> &leaf_mac) {
  std::vector<uint8_t> frame(sizeof(espnow_frame_header_t) + sizeof(espnow_discover_t), 0);
  auto *header = reinterpret_cast<espnow_frame_header_t *>(frame.data());
  header->protocol_version = ESPNOW_PROTOCOL_VER;
  header->hop_count = ESPNOW_HOPS_MAKE(ESPNOW_HOPS_DIR_UP, 0);
  header->packet_type = PKT_DISCOVER;
  std::memcpy(header->leaf_mac, leaf_mac.data(), leaf_mac.size());
  header->tx_counter = 1;

  uint8_t *payload = frame.data() + sizeof(espnow_frame_header_t);
  auto *discover = reinterpret_cast<espnow_discover_t *>(payload);
  std::memcpy(discover->network_id, kNetworkId, std::strlen(kNetworkId));
  discover->network_id_len = static_cast<uint8_t>(std::strlen(kNetworkId));
  discover->capability_flags = 0;

  espnow_crypto_psk_tag(frame.data(), payload, sizeof(espnow_discover_t), header->psk_tag);
  return frame;
}

struct Rig {
  BridgeProtocol protocol;

  Rig() {
    protocol.init(kPsk, kNetworkId, /*heartbeat_interval=*/60);
    protocol.set_send_fn([](const uint8_t *, const uint8_t *, size_t) { return true; });
  }

  bool feed(const std::array<uint8_t, 6> &leaf_mac) {
    const std::vector<uint8_t> frame = make_discover(leaf_mac);
    const std::array<uint8_t, 6> sender = mac_for(0xFFFF);  // last hop differs from the leaf
    return protocol.on_espnow_frame(sender.data(), frame.data(), frame.size(), -60);
  }
};

void test_cap_refuses_the_extra_node() {
  test::reset_mock_state();
  Rig rig;

  for (uint32_t i = 0; i < BridgeProtocol::MAX_SESSIONS; ++i) {
    expect(rig.feed(mac_for(i)), "DISCOVER from a node within the limit is handled");
  }
  expect(rig.protocol.get_sessions().size() == BridgeProtocol::MAX_SESSIONS,
         "table holds exactly MAX_SESSIONS sessions");

  // Known nodes keep working: no lockout once the table is full.
  expect(rig.feed(mac_for(0)), "DISCOVER from an existing node is still handled");
  expect(rig.protocol.get_sessions().size() == BridgeProtocol::MAX_SESSIONS,
         "an existing node does not add a session");

  // The extra node is refused rather than allocating past the cap.
  const std::array<uint8_t, 6> extra = mac_for(BridgeProtocol::MAX_SESSIONS);
  expect(!rig.feed(extra), "DISCOVER from node MAX_SESSIONS+1 is refused");
  expect(rig.protocol.get_sessions().size() == BridgeProtocol::MAX_SESSIONS,
         "a refused node adds no session");
  expect(rig.protocol.get_session(extra.data()) == nullptr, "a refused node has no session");
  expect(rig.protocol.get_session(mac_for(0).data()) != nullptr, "existing sessions survive the refusal");
}

void test_low_ram_eviction_with_a_full_table() {
  test::reset_mock_state();
  Rig rig;

  for (uint32_t i = 0; i < BridgeProtocol::MAX_SESSIONS; ++i) {
    (void) rig.feed(mac_for(i));
  }
  expect(rig.protocol.get_sessions().size() == BridgeProtocol::MAX_SESSIONS, "table filled");

  // 3% free: below RAM_WARNING_PCT, so the 60 s cleanup runs eviction over a full
  // table. Before the fix this walked 128 entries into a 128-entry stack array.
  test::set_mock_heap_sizes(9000, 300 * 1024);
  test::advance_mock_time_ms(60001);
  rig.protocol.loop();

  const size_t after = rig.protocol.get_sessions().size();
  expect(after == BridgeProtocol::MIN_SESSIONS_TO_PROTECT,
         "eviction keeps MIN_SESSIONS_TO_PROTECT sessions and frees the rest");

  // Room to join again.
  const std::array<uint8_t, 6> fresh = mac_for(1000);
  expect(rig.feed(fresh), "a new node is accepted after eviction made room");
  expect(rig.protocol.get_session(fresh.data()) != nullptr, "the new node has a session");
  expect(rig.protocol.get_sessions().size() == after + 1, "the new session is the only addition");
}

}  // namespace

int main() {
  test_cap_refuses_the_extra_node();
  test_low_ram_eviction_with_a_full_table();

  if (g_failures != 0) {
    std::cerr << g_failures << " bridge_session_cap test(s) failed\n";
    return 1;
  }
  std::cout << "bridge_session_cap tests passed\n";
  return 0;
}
