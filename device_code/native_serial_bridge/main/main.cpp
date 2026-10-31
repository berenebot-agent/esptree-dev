#include <cstdlib>
#include <cstring>
#include "esp_err.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"
#include "esp_wifi.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs_flash.h"
#include "sdkconfig.h"
#include "soc/soc_caps.h"
#include "esp_tree_bridge.h"
#include "esphome/components/uart/uart_component.h"
#include "esphome/core/application.h"

#if !defined(SOC_WIFI_SUPPORTED) || !SOC_WIFI_SUPPORTED
#error "ESP Tree serial bridge requires an ESP32 SoC with integrated Wi-Fi/ESP-NOW."
#endif

#if !defined(CONFIG_IDF_TARGET_ESP32) && !defined(CONFIG_IDF_TARGET_ESP32S2) && \
    !defined(CONFIG_IDF_TARGET_ESP32S3) && !defined(CONFIG_IDF_TARGET_ESP32C2) && \
    !defined(CONFIG_IDF_TARGET_ESP32C3) && !defined(CONFIG_IDF_TARGET_ESP32C5) && \
    !defined(CONFIG_IDF_TARGET_ESP32C6)
#error "Unsupported ESP-IDF target: choose esp32, esp32s2, esp32s3, esp32c2, esp32c3, esp32c5, or esp32c6."
#endif

static_assert(CONFIG_ESP_TREE_UART_PORT >= 0 &&
              CONFIG_ESP_TREE_UART_PORT < SOC_UART_NUM,
              "The chosen UART does not exist on this ESP32 target");
static_assert(CONFIG_ESP_TREE_UART_TX_GPIO != CONFIG_ESP_TREE_UART_RX_GPIO,
              "UART TX and RX cannot be the same GPIO");

namespace {
// Compiled out in the release flavour (CONFIG_LOG_MAXIMUM_LEVEL == 0); visible
// in the --debug flavour. Either way nothing is written to the data UART.
[[maybe_unused]] constexpr char TAG[] = "esp_tree_native";

// Allocated, never destroyed. ESPTreeBridge holds unique_ptr members whose
// pointed-to types are only defined inside its own translation unit, so a
// namespace-scope instance would require the implicit destructor here and fail
// on an incomplete type. ESPHome's generated code allocates the component for
// the same reason, and this firmware never tears the bridge down.
esphome::esp_tree::ESPTreeBridge *const bridge = new esphome::esp_tree::ESPTreeBridge();
static esphome::uart::UARTComponent serial_link;

// Fail closed, but leave a trail: a silent reboot loop is indistinguishable from
// a dead board. In the release flavour this prints nothing by design.
[[noreturn]] void fail(const char *why) {
  ESP_LOGE(TAG, "refusing to run: %s", why);
  abort();
}

bool valid_psk(const char *psk) {
  if (std::strlen(psk) != 64) return false;
  for (const char *p = psk; *p; ++p) {
    if (!((*p >= '0' && *p <= '9') ||
          (*p >= 'a' && *p <= 'f') ||
          (*p >= 'A' && *p <= 'F'))) return false;
  }
  return true;
}
}  // namespace

extern "C" void app_main() {
  // Fail closed on missing credentials (no console output on the data UART).
  if (std::strlen(CONFIG_ESP_TREE_NETWORK_ID) == 0) {
    fail("CONFIG_ESP_TREE_NETWORK_ID is empty (idf.py menuconfig)");
  }
  if (!valid_psk(CONFIG_ESP_TREE_PSK)) {
    fail("CONFIG_ESP_TREE_PSK is not 64 hexadecimal characters (idf.py menuconfig)");
  }
  if (std::strlen(CONFIG_ESP_TREE_API_KEY) == 0) {
    fail("CONFIG_ESP_TREE_API_KEY is empty (idf.py menuconfig)");
  }

  esp_err_t err = nvs_flash_init();
  if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
    ESP_ERROR_CHECK(nvs_flash_erase());
    err = nvs_flash_init();
  }
  ESP_ERROR_CHECK(err);
  ESP_ERROR_CHECK(esp_netif_init());
  ESP_ERROR_CHECK(esp_event_loop_create_default());

  // Every target uses the same binary-only hardware UART implementation.
  // The chip's default pins come from Kconfig and may be overridden per board.
  ESP_ERROR_CHECK(serial_link.begin(
      static_cast<uart_port_t>(CONFIG_ESP_TREE_UART_PORT),
      CONFIG_ESP_TREE_UART_BAUD,
      CONFIG_ESP_TREE_UART_TX_GPIO,
      CONFIG_ESP_TREE_UART_RX_GPIO));

  esphome::App.set_name(CONFIG_ESP_TREE_NODE_NAME);
  bridge->set_bridge_friendly_name(CONFIG_ESP_TREE_NODE_NAME);
  bridge->set_hostname(CONFIG_ESP_TREE_NODE_NAME);
  bridge->set_network_id(CONFIG_ESP_TREE_NETWORK_ID);
  bridge->set_psk(CONFIG_ESP_TREE_PSK);
  bridge->set_api_key(CONFIG_ESP_TREE_API_KEY);
#ifdef CONFIG_ESP_TREE_RADIO_LR
  bridge->set_espnow_mode("lr");
#else
  bridge->set_espnow_mode("regular");
#endif
#ifdef CONFIG_ESP_TREE_REMOTE_OTA
  bridge->set_ota_over_espnow(true);
#else
  bridge->set_ota_over_espnow(false);
#endif
  bridge->set_uart_component(&serial_link);
  bridge->setup();
  if (bridge->is_failed()) {
    fail("bridge setup failed (see menuconfig credentials and radio mode)");
  }

  // ESP-NOW runs over the Wi-Fi radio in STA mode without joining an AP.
  // Explicitly select the remote network's 2.4 GHz channel before starting
  // the bridge's protocol loop.
  //
  // Both the set and the read-back are checked: a bridge left on the driver's
  // default channel still answers the add-on, still reports snapshots and still
  // looks online, but hears nothing on air -- the same silent failure the
  // production init path documents. Peers are created with the channel current
  // at esp_now_add_peer() time, so a mismatch would also pin every peer to the
  // wrong channel.
  ESP_ERROR_CHECK(esp_wifi_set_channel(CONFIG_ESP_TREE_RADIO_CHANNEL,
                                       WIFI_SECOND_CHAN_NONE));
  uint8_t active_channel = 0;
  wifi_second_chan_t active_secondary = WIFI_SECOND_CHAN_NONE;
  ESP_ERROR_CHECK(esp_wifi_get_channel(&active_channel, &active_secondary));
  if (active_channel != CONFIG_ESP_TREE_RADIO_CHANNEL) {
    fail("radio channel read-back does not match CONFIG_ESP_TREE_RADIO_CHANNEL");
  }

#ifdef CONFIG_ESP_TREE_RADIO_LR
  constexpr const char *kMode = "lr";
#else
  constexpr const char *kMode = "regular";
#endif
  ESP_LOGI(TAG, "serial bridge up: uart%d %d baud, channel %u, mode %s",
           CONFIG_ESP_TREE_UART_PORT, CONFIG_ESP_TREE_UART_BAUD,
           static_cast<unsigned>(active_channel), kMode);

  for (;;) {
    bridge->loop();
    bridge->run_intervals();
    vTaskDelay(1);
  }
}
