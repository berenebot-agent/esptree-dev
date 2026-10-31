#pragma once
// Minimal cJSON-backed adapter for existing ESPHome parse_json call sites.
#include <string>
#include <type_traits>
#include <utility>
#include "cJSON.h"

namespace esphome {
class JsonValue;

class JsonObject {
 public:
  explicit JsonObject(cJSON *node = nullptr) : node_(node) {}
  JsonValue operator[](const char *key) const;
 private:
  cJSON *node_;
};

class JsonValue {
 public:
  explicit JsonValue(cJSON *node = nullptr) : node_(node) {}
  template<typename T> bool is() const {
    if constexpr (std::is_same_v<T, JsonObject>) {
      return cJSON_IsObject(node_);
    } else if constexpr (std::is_same_v<T, const char *>) {
      return cJSON_IsString(node_);
    } else if constexpr (std::is_same_v<T, bool>) {
      return cJSON_IsBool(node_);
    } else if constexpr (std::is_integral_v<T>) {
      // ESPHome's variant distinguishes integers from floats, and the command
      // parsers depend on it: `speed_level: 2.5` must be rejected, not silently
      // truncated to 2. cJSON only reports "number", so require the value to be
      // integral as well.
      return cJSON_IsNumber(node_) && node_->valuedouble ==
                                          static_cast<double>(
                                              static_cast<long long>(node_->valuedouble));
    } else if constexpr (std::is_floating_point_v<T>) {
      return cJSON_IsNumber(node_);
    }
    return false;
  }
  template<typename T> T as() const {
    if constexpr (std::is_same_v<T, JsonObject>) {
      return JsonObject(node_);
    } else if constexpr (std::is_same_v<T, std::string>) {
      return cJSON_IsString(node_) ? std::string(cJSON_GetStringValue(node_)) : std::string();
    } else if constexpr (std::is_same_v<T, bool>) {
      return cJSON_IsTrue(node_);
    } else if constexpr (std::is_arithmetic_v<T>) {
      return cJSON_IsNumber(node_) ? static_cast<T>(node_->valuedouble) : T{};
    } else {
      return T{};
    }
  }
  operator const char *() const {
    return cJSON_IsString(node_) ? cJSON_GetStringValue(node_) : nullptr;
  }
  int operator|(int fallback) const {
    return cJSON_IsNumber(node_) ? node_->valueint : fallback;
  }
 private:
  cJSON *node_;
};
inline JsonValue JsonObject::operator[](const char *key) const {
  return JsonValue(cJSON_IsObject(node_) ? cJSON_GetObjectItemCaseSensitive(node_, key) : nullptr);
}

namespace json {
template<typename Callback>
bool parse_json(const std::string &payload, Callback &&callback) {
  cJSON *root = cJSON_Parse(payload.c_str());
  if (root == nullptr) return false;
  const bool ok = cJSON_IsObject(root) && callback(JsonObject(root));
  cJSON_Delete(root);
  return ok;
}
}  // namespace json
}  // namespace esphome
