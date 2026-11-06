#pragma once

// Shared host test clock. The declarations and the millis()/esp_random()/
// delay() shims live in esphome/core/hal.h, which is the header the component
// code includes; this file is the include point for tests that do not pull that
// header in themselves. Keeping one copy means the two cannot drift, and
// including both no longer redefines millis().
#include "esphome/core/hal.h"

#include <cstdint>

namespace test {

// Heap sizes reported by the esp_heap_caps.h mock, so tests can force the
// bridge's low-RAM eviction paths.
void set_mock_heap_sizes(uint32_t free_bytes, uint32_t total_bytes);
uint32_t mock_free_heap();
uint32_t mock_total_heap();

}  // namespace test
