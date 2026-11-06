#pragma once

// Host stub for <esp_system.h>. Rebooting a host test would end the process, so
// it is counted instead of performed.

#include <cstdint>

uint32_t esp_get_free_heap_size(void);
void esp_restart(void);
