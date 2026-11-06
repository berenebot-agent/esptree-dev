#pragma once

// Host stub for the slice of esphome/core/application.h the leaf protocol uses.

namespace esphome {

class Application {
 public:
  // Rebooting a host test would end the process; record it instead.
  void safe_reboot() { reboots_requested++; }
  int reboots_requested{0};
};

extern Application App;

}  // namespace esphome
