#pragma once
#include <cstdint>
#include <vector>
#include "driver/uart.h"
#include "esp_err.h"

namespace esphome {
namespace uart {

class UARTComponent {
 public:
  esp_err_t begin(uart_port_t port, int baud, int tx_gpio, int rx_gpio) {
    port_ = port;
    uart_config_t config{};
    config.baud_rate = baud;
    config.data_bits = UART_DATA_8_BITS;
    config.parity = UART_PARITY_DISABLE;
    config.stop_bits = UART_STOP_BITS_1;
    config.flow_ctrl = UART_HW_FLOWCTRL_DISABLE;
    config.source_clk = UART_SCLK_DEFAULT;
    esp_err_t err = uart_param_config(port_, &config);
    if (err != ESP_OK) return err;
    err = uart_set_pin(port_, tx_gpio, rx_gpio, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE);
    if (err != ESP_OK) return err;
    return uart_driver_install(port_, 16384, 16384, 0, nullptr, 0);
  }

  int available() const {
    size_t len = 0;
    return uart_get_buffered_data_len(port_, &len) == ESP_OK
               ? static_cast<int>(len) : 0;
  }
  bool read_byte(uint8_t *byte) {
    return byte != nullptr && uart_read_bytes(port_, byte, 1, 0) == 1;
  }
  void write_array(const std::vector<uint8_t> &bytes) {
    if (!bytes.empty()) {
      uart_write_bytes(port_, reinterpret_cast<const char *>(bytes.data()), bytes.size());
    }
  }
 private:
  uart_port_t port_{UART_NUM_0};
};

}  // namespace uart
}  // namespace esphome
