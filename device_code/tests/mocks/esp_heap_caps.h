#pragma once

// Host stub for <esp_heap_caps.h>. The values are driven by the test clock
// module so a test can force the bridge's low-RAM paths.

#include <cstddef>
#include <cstdint>

#define MALLOC_CAP_8BIT 0
#define MALLOC_CAP_DEFAULT 0

size_t heap_caps_get_total_size(uint32_t caps);
size_t heap_caps_get_largest_free_block(uint32_t caps);
uint32_t esp_get_free_heap_size(void);
