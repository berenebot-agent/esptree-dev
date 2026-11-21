#pragma once

#include <cstddef>
#include <cstdint>
#include <vector>

namespace esphome {
namespace esp_tree {
namespace bridge_api {

// Splits a serial byte stream into raw (still COBS-encoded) frames on 0x00.
//
// Header-only and dependency-free so the overflow behaviour is host-testable.
//
// Overflow: when a frame grows past max_bytes without a delimiter, the partial
// frame is thrown away and everything up to the next 0x00 is discarded. The
// previous implementation stopped appending instead, so the 0x00 delimiters were
// dropped too and the buffer could never drain: the bridge went deaf until
// reboot (and before authentication nothing ever reset it). Line noise on
// plug-in, a terminal opened on the port or a baud mismatch could trigger it.
class SerialFrameAccumulator {
 public:
  explicit SerialFrameAccumulator(size_t max_bytes) : max_bytes_(max_bytes) {}

  // Feed one byte. Returns true when `frame_out` holds a complete, non-empty
  // frame (delimiter not included).
  bool push(uint8_t byte, std::vector<uint8_t> &frame_out) {
    if (byte == 0x00) {
      if (discarding_) {
        discarding_ = false;  // resynchronised on the delimiter
        buffer_.clear();
        return false;
      }
      if (buffer_.empty()) return false;
      frame_out.swap(buffer_);
      buffer_.clear();
      return true;
    }
    if (discarding_) {
      ++dropped_;
      return false;
    }
    if (buffer_.size() >= max_bytes_) {
      dropped_ += buffer_.size() + 1;
      ++overflows_;
      buffer_.clear();
      discarding_ = true;
      return false;
    }
    buffer_.push_back(byte);
    return false;  // frame not complete yet
  }

  void clear() {
    buffer_.clear();
    discarding_ = false;
  }

  size_t buffered() const { return buffer_.size(); }
  bool discarding() const { return discarding_; }
  uint32_t dropped() const { return dropped_; }
  uint32_t overflows() const { return overflows_; }

 private:
  size_t max_bytes_;
  std::vector<uint8_t> buffer_;
  bool discarding_{false};
  uint32_t dropped_{0};
  uint32_t overflows_{0};
};

}  // namespace bridge_api
}  // namespace esp_tree
}  // namespace esphome
