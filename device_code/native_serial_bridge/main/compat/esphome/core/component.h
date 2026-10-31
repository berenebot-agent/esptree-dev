#pragma once
#include <cstdint>
#include <functional>
#include <string>
#include <utility>
#include <vector>
#include "esphome/core/hal.h"

namespace esphome {
namespace setup_priority {
static constexpr float AFTER_WIFI = 200.0f;
}

class Component {
 public:
  virtual ~Component() = default;
  virtual void setup() {}
  virtual void loop() {}
  virtual void dump_config() {}
  virtual float get_setup_priority() const { return 0.0f; }
  void mark_failed() { failed_ = true; }
  bool is_failed() const { return failed_; }

  void set_interval(const std::string &, uint32_t period_ms,
                    std::function<void()> callback) {
    intervals_.push_back({period_ms, millis(), std::move(callback)});
  }
  void run_intervals() {
    const uint32_t now = millis();
    for (auto &entry : intervals_) {
      if (entry.period_ms && now - entry.last_ms >= entry.period_ms) {
        entry.last_ms = now;
        entry.callback();
      }
    }
  }
 private:
  bool failed_{false};
  struct Interval {
    uint32_t period_ms;
    uint32_t last_ms;
    std::function<void()> callback;
  };
  std::vector<Interval> intervals_;
};
}  // namespace esphome
