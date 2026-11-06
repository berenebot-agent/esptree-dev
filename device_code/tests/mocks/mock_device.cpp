// Host stand-ins for the two device-side symbols the leaf protocol can reach:
// the ESPHome Application singleton (App.safe_reboot) and esp_restart(). A host
// test cannot reboot, so a restart is reported instead of performed.
#include "esphome/core/application.h"

#include <cstdio>

namespace esphome {

Application App;

}  // namespace esphome

void esp_restart(void) {
  std::fprintf(stderr, "[mock] esp_restart() called\n");
}
