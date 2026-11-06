#pragma once

// Host stubs for the app-description headers the leaf protocol includes to read
// the build date/time for its identity descriptor.

#include <esp_err.h>
#include <esp_ota_ops.h>

#include <cstdint>

#define ESP_APP_DESC_MAGIC_WORD 0xABCD5432

typedef struct {
  uint32_t magic_word;
  uint32_t secure_version;
  uint32_t reserv1[2];
  char version[32];
  char project_name[32];
  char time[16];
  char date[16];
  char idf_ver[32];
  uint8_t app_elf_sha256[32];
  uint32_t reserv2[20];
} esp_app_desc_t;

static inline esp_err_t esp_ota_get_partition_description(const esp_partition_t *, esp_app_desc_t *) {
  return ESP_FAIL;
}
