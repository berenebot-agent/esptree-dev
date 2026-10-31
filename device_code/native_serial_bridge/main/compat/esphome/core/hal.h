#pragma once
#include <cstdint>
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

namespace esphome {
inline uint32_t millis() {
  return static_cast<uint32_t>(esp_timer_get_time() / 1000);
}
inline void delay(uint32_t ms) {
  if (ms == 0) {
    taskYIELD();
  } else {
    vTaskDelay((ms + portTICK_PERIOD_MS - 1) / portTICK_PERIOD_MS);
  }
}
}  // namespace esphome
