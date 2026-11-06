#pragma once

// Host stub for <esp_ota_ops.h>/<esp_partition.h>: the leaf protocol only asks
// which partition is running so it can read the build date and image MD5 for its
// identity descriptor. There is no running partition on a host, so that path is
// skipped. remote_file_receiver.h supplies the host definition of
// esp_partition_t, so only a forward declaration lives here.

#include <esp_err.h>

#include <cstddef>
#include <cstdint>

struct esp_partition_t;

static inline const esp_partition_t *esp_ota_get_running_partition(void) { return nullptr; }
static inline esp_err_t esp_partition_read(const esp_partition_t *, size_t, void *, size_t) { return ESP_FAIL; }
