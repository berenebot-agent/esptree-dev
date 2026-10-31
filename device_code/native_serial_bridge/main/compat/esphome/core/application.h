#pragma once
#include <cstdint>
#include <string>
#include <utility>

namespace esphome {
class Application {
 public:
  struct Name {
    std::string value;
    std::string str() const { return value; }
  };
  Name get_name() const { return {name_}; }
  void set_name(std::string name) { name_ = std::move(name); }
  uint32_t get_build_time() const { return 0; }
 private:
  std::string name_{"esp-tree-native-serial"};
};
inline Application App;
}  // namespace esphome
