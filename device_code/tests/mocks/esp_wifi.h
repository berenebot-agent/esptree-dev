#pragma once

// Host stub for the tiny slice of <esp_wifi.h> the protocol code uses: it reads
// and restores the current channel around discovery, and checks for a start
// error.

#include <esp_err.h>

#include <cstdint>

typedef enum {
  WIFI_SECOND_CHAN_NONE = 0,
  WIFI_SECOND_CHAN_ABOVE,
  WIFI_SECOND_CHAN_BELOW,
} wifi_second_chan_t;

#ifndef ESP_ERR_WIFI_NOT_STARTED
#define ESP_ERR_WIFI_NOT_STARTED 0x3001
#endif

#ifndef ESP_ERR_WIFI_CONN
#define ESP_ERR_WIFI_CONN 0x3008
#endif

static inline esp_err_t esp_wifi_get_channel(uint8_t *primary, wifi_second_chan_t *second) {
  if (primary != nullptr) *primary = 1;
  if (second != nullptr) *second = WIFI_SECOND_CHAN_NONE;
  return ESP_OK;
}

static inline esp_err_t esp_wifi_set_channel(uint8_t, wifi_second_chan_t) { return ESP_OK; }

static inline esp_err_t esp_wifi_start(void) { return ESP_OK; }
