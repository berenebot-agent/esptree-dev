#include <cstdlib>
#include <cstring>
#include "esp_err.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "esp_wifi.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs_flash.h"
#include "sdkconfig.h"
#include "esp_tree_bridge.h"
#include "esphome/components/uart/uart_component.h"
#include "esphome/core/application.h"

namespace {
static esphome::esp_tree::ESPTreeBridge bridge;
static esphome::uart::UARTComponent serial_link;
}

extern "C" void app_main() {
  // Never expose a partially provisioned bridge.
  if (std::strlen(CONFIG_ESP_TREE_NETWORK_ID) == 0 ||
      std::strlen(CONFIG_ESP_TREE_PSK) != 64 ||
      std::strlen(CONFIG_ESP_TREE_API_KEY) == 0) {
    abort();
  }
  esp_err_t err = nvs_flash_init();
  if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
    ESP_ERROR_CHECK(nvs_flash_erase());
    err = nvs_flash_init();
  }
  ESP_ERROR_CHECK(err);
  ESP_ERROR_CHECK(esp_netif_init());
  ESP_ERROR_CHECK(esp_event_loop_create_default());

  // sdkconfig.defaults disables IDF console/logging on the binary UART.
  ESP_ERROR_CHECK(serial_link.begin(
      static_cast<uart_port_t>(CONFIG_ESP_TREE_UART_PORT),
      CONFIG_ESP_TREE_UART_BAUD,
      CONFIG_ESP_TREE_UART_TX_GPIO,
      CONFIG_ESP_TREE_UART_RX_GPIO));

  esphome::App.set_name(CONFIG_ESP_TREE_NODE_NAME);
  bridge.set_bridge_friendly_name(CONFIG_ESP_TREE_NODE_NAME);
  bridge.set_hostname(CONFIG_ESP_TREE_NODE_NAME);
  bridge.set_network_id(CONFIG_ESP_TREE_NETWORK_ID);
  bridge.set_psk(CONFIG_ESP_TREE_PSK);
  bridge.set_api_key(CONFIG_ESP_TREE_API_KEY);
#ifdef CONFIG_ESP_TREE_RADIO_LR
  bridge.set_espnow_mode("lr");
#else
  bridge.set_espnow_mode("regular");
#endif
#ifdef CONFIG_ESP_TREE_REMOTE_OTA
  bridge.set_ota_over_espnow(true);
#else
  bridge.set_ota_over_espnow(false);
#endif
  bridge.set_uart_component(&serial_link);
  bridge.setup();
  if (bridge.is_failed()) abort();

  // Production bridge initialises Wi-Fi STA for ESP-NOW without AP association.
  // Set channel before processing any DISCOVER traffic.
  ESP_ERROR_CHECK(esp_wifi_set_channel(
      CONFIG_ESP_TREE_RADIO_CHANNEL, WIFI_SECOND_CHAN_NONE));

  for (;;) {
    bridge.loop();
    bridge.run_intervals();
    vTaskDelay(1);
  }
}
