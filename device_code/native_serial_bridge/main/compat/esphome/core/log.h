#pragma once
// ESP-IDF logging is compiled out by sdkconfig.defaults. There must never
// be human-readable logs multiplexed with COBS/protobuf on UART0.
#include "esp_log.h"
#define ESPHOME_VERSION "native-esp-idf"
