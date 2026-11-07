#include <cstddef>
#include <cstdint>

struct __attribute__((packed)) espnow_heartbeat_t {
  uint32_t uptime_seconds;
  uint32_t expected_contact_interval_seconds;
  uint8_t parent_mac[6];
  uint8_t direct_child_count;
  uint16_t total_child_count;
  int8_t remote_rssi_dbm;
};

int main() {
  static_assert(sizeof(espnow_heartbeat_t) == 18, "heartbeat payload size changed unexpectedly");
  // The field order is the wire format: mirror espnow_types.h exactly, or this
  // test passes while the bridge reads the wrong byte as the leaf's RSSI.
  return offsetof(espnow_heartbeat_t, parent_mac) == 8 &&
                 offsetof(espnow_heartbeat_t, remote_rssi_dbm) == 17
             ? 0
             : 1;
}
