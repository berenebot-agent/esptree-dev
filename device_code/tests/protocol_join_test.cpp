// End-to-end join test: a real RemoteProtocol and a real BridgeProtocol talk to
// each other over in-memory queues, with the host clock driving discovery,
// schema exchange, state sync and join completion.
//
// This is the first test that compiles remote_protocol.cpp and
// bridge_protocol.cpp together, so a regression in the join/session state
// machine shows up here instead of on hardware. It also covers the replay gate:
// re-feeding a captured STATE frame must not publish the value twice.
#include "../components/esp_tree_remote/remote_protocol.h"
#include "../components/esp_tree_bridge/bridge_protocol.h"

#include "mocks/test_time.h"

#include <algorithm>
#include <array>
#include <cstdint>
#include <cstring>
#include <deque>
#include <iostream>
#include <string>
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
constexpr const char *kNetworkId = "join-e2e-net";
constexpr const char *kNodeName = "e2e-node";
constexpr const char *kNodeLabel = "E2E Node";

const std::array<uint8_t, 6> kBridgeMac{0x02, 0xAA, 0xBB, 0xCC, 0xDD, 0x01};
const std::array<uint8_t, 6> kRemoteMac{0x02, 0x11, 0x22, 0x33, 0x44, 0x55};

struct Frame {
  std::vector<uint8_t> data;
};

[[nodiscard]] espnow_packet_type_t frame_type(const std::vector<uint8_t> &frame) {
  if (frame.size() < sizeof(espnow_frame_header_t)) return PKT_DISCOVER;
  return static_cast<espnow_packet_type_t>(frame[2]);
}

struct Rig {
  std::deque<Frame> to_bridge;
  std::deque<Frame> to_remote;
  std::vector<std::vector<uint8_t>> sent_by_remote;

  BridgeProtocol bridge;
  RemoteProtocol remote;

  int published_states{0};
  std::vector<uint8_t> last_published_value;
  uint8_t last_published_type{0};
  std::string last_published_name;
  int discovery_publishes{0};
  std::vector<uint8_t> discovery_types;
  bool remote_online_seen{false};

  Rig() {
    bridge.init(kPsk, kNetworkId, /*heartbeat_interval=*/10);
    bridge.set_bridge_mac(kBridgeMac.data());

    remote.init(kPsk, kNetworkId, kNodeName, kNodeLabel, /*firmware_epoch=*/1, "esptree.e2e", "1.0",
                /*heartbeat_interval=*/10);
    remote.set_local_mac(kRemoteMac.data());
    remote.set_relay_config(/*relay_enabled=*/false, /*max_hops=*/0, /*max_discover_pending=*/0);
    remote.set_command_fn([](uint8_t, uint8_t, const uint8_t *, size_t) {});

    remote.set_send_fn([this](const uint8_t *, const uint8_t *frame, size_t len) {
      std::vector<uint8_t> copy(frame, frame + len);
      sent_by_remote.push_back(copy);
      to_bridge.push_back(Frame{std::move(copy)});
      return true;
    });
    bridge.set_send_fn([this](const uint8_t *, const uint8_t *frame, size_t len) {
      to_remote.push_back(Frame{std::vector<uint8_t>(frame, frame + len)});
      return true;
    });

    bridge.set_publish_discovery_fn(
        [this](const uint8_t *, const BridgeEntitySchema &entity, uint8_t, bool) {
          ++discovery_publishes;
          discovery_types.push_back(entity.entity_type);
        });
    bridge.set_publish_state_fn([this](const uint8_t *mac, const BridgeEntitySchema &entity,
                                       const std::vector<uint8_t> &value, espnow_field_type_t type,
                                       const std::string &, uint32_t message_tx_base,
                                       const uint8_t *next_hop_mac) {
      ++published_states;
      last_published_value = value;
      last_published_type = static_cast<uint8_t>(type);
      last_published_name = entity.entity_name;
      // In the firmware the MQTT/protobuf sink confirms delivery, which is what
      // sends the STATE ACK and lets the join finish.
      bridge.confirm_state_delivery_(mac, entity.entity_index, message_tx_base, next_hop_mac);
    });
    bridge.set_publish_availability_fn([this](const uint8_t *, bool online, const char *) {
      if (online) remote_online_seen = true;
    });
    bridge.set_clear_entities_fn([](const uint8_t *, const std::vector<BridgeEntitySchema> &) {});
    bridge.set_schema_complete_fn([](const uint8_t *, uint8_t) {});

    // One sensor entity, with a state value to push during join.
    remote.register_entity(FIELD_TYPE_SENSOR, "Temperature", "C", "", "temp");
    const float celsius = 21.5f;
    uint8_t value[sizeof(float)];
    std::memcpy(value, &celsius, sizeof(value));
    remote.on_entity_state_change(0, value, sizeof(value));
  }

  // Deliver queued frames in both directions until both queues are empty.
  void pump() {
    for (int guard = 0; guard < 10000; ++guard) {
      bool moved = false;
      if (!to_bridge.empty()) {
        Frame frame = std::move(to_bridge.front());
        to_bridge.pop_front();
        bridge.on_espnow_frame(kRemoteMac.data(), frame.data.data(), frame.data.size(), -55);
        moved = true;
      }
      if (!to_remote.empty()) {
        Frame frame = std::move(to_remote.front());
        to_remote.pop_front();
        remote.on_espnow_frame(kBridgeMac.data(), frame.data.data(), frame.data.size(), -55);
        moved = true;
      }
      if (!moved) return;
    }
    std::cerr << "FAIL: frame pump did not drain (possible loop)\n";
    ++g_failures;
  }

  void run_until_normal(uint32_t max_ms = 30000) {
    for (uint32_t t = 0; t <= max_ms; t += 10) {
      test::set_mock_time_ms(t);
      remote.loop();
      bridge.loop();
      pump();
      if (std::string(remote.state_name()) == "NORMAL" && published_states > 0) return;
    }
  }
};

void test_join_reaches_normal_and_publishes_state() {
  test::reset_mock_state();
  Rig rig;
  rig.run_until_normal();

  expect(std::string(rig.remote.state_name()) == "NORMAL", "leaf reaches NORMAL");
  expect(rig.bridge.get_sessions().size() == 1, "bridge keeps exactly one session");
  const BridgeSession *session = rig.bridge.get_session(kRemoteMac.data());
  expect(session != nullptr, "bridge has a session for the leaf");
  if (session != nullptr) {
    expect(session->session_key_valid, "session key derived on both sides");
    expect(session->schema_received, "bridge received the schema");
    expect(session->schema_entities.size() == 1, "one schema entity");
    if (!session->schema_entities.empty()) {
      expect(session->schema_entities[0].entity_name == "Temperature", "schema entity name survives the wire");
      expect(session->schema_entities[0].entity_type == FIELD_TYPE_SENSOR, "schema entity type survives the wire");
    }
  }
  expect(rig.remote_online_seen, "bridge marked the leaf online");

  expect(rig.discovery_publishes >= 1, "discovery was published for the entity");
  expect(rig.published_states >= 1, "the leaf's state reached the bridge");
  expect(rig.last_published_name == "Temperature", "published state is for the right entity");
  expect(rig.last_published_type == FIELD_TYPE_SENSOR, "published state keeps its type");
  expect(rig.last_published_value.size() == sizeof(float), "published state keeps its width");
  if (rig.last_published_value.size() == sizeof(float)) {
    float value = 0.0f;
    std::memcpy(&value, rig.last_published_value.data(), sizeof(value));
    expect(value == 21.5f, "published state value is the one the leaf set");
  }
}

void test_replayed_state_frame_is_not_published_twice() {
  test::reset_mock_state();
  Rig rig;
  rig.run_until_normal();

  // Capture the first STATE frame the leaf sent.
  std::vector<uint8_t> state_frame;
  for (const auto &frame : rig.sent_by_remote) {
    if (frame_type(frame) == PKT_STATE) {
      state_frame = frame;
      break;
    }
  }
  expect(!state_frame.empty(), "captured a STATE frame to replay");
  if (state_frame.empty()) return;

  const int before = rig.published_states;
  rig.bridge.on_espnow_frame(kRemoteMac.data(), state_frame.data(), state_frame.size(), -55);
  expect(rig.published_states == before, "a replayed STATE frame does not publish again");
}

// The bridge publishes discovery only for entity types it can render. A leaf
// that sends a reserved-but-unimplemented code (HUMIDIFIER, 0x0F) or a code
// this build has never seen (0x99) must not reach Home Assistant: there is no
// state encoder or command decoder behind either, so publishing it would create
// an entity that can only ever read back "null".
void test_unsupported_entity_types_are_not_published() {
  test::reset_mock_state();
  Rig rig;
  rig.remote.register_entity(static_cast<espnow_field_type_t>(FIELD_TYPE_HUMIDIFIER), "Humidity", "", "", "hum");
  rig.remote.register_entity(static_cast<espnow_field_type_t>(0x99), "Mystery", "", "", "mystery");
  rig.run_until_normal();

  const BridgeSession *session = rig.bridge.get_session(kRemoteMac.data());
  expect(session != nullptr, "bridge has a session for a leaf with unsupported entities");
  if (session != nullptr) {
    expect(session->schema_entities.size() == 3, "all three schema entities reach the bridge");
  }
  const bool only_sensor = std::all_of(rig.discovery_types.begin(), rig.discovery_types.end(),
                                       [](uint8_t type) { return type == FIELD_TYPE_SENSOR; });
  expect(!rig.discovery_types.empty(), "the supported entity still gets discovery");
  expect(only_sensor, "discovery is never published for an unsupported entity type");
  expect(std::find(rig.discovery_types.begin(), rig.discovery_types.end(), FIELD_TYPE_HUMIDIFIER) ==
             rig.discovery_types.end(),
         "the reserved HUMIDIFIER code is skipped");
  expect(std::find(rig.discovery_types.begin(), rig.discovery_types.end(), 0x99) == rig.discovery_types.end(),
         "an unknown type code is skipped");
}

}  // namespace

int main() {
  test_join_reaches_normal_and_publishes_state();
  test_replayed_state_frame_is_not_published_twice();
  test_unsupported_entity_types_are_not_published();

  if (g_failures != 0) {
    std::cerr << g_failures << " protocol_join test(s) failed\n";
    return 1;
  }
  std::cout << "protocol_join tests passed\n";
  return 0;
}
