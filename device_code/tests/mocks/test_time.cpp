#include "test_time.h"
#include "esp_heap_caps.h"
#include <cstdint>
#include <random>

namespace test {

static uint32_t g_mock_time_ms = 0;
static uint32_t g_mock_random_seed = 12345;
static std::mt19937 g_mock_rng(g_mock_random_seed);
static uint32_t g_mock_free_heap = 200 * 1024;
static uint32_t g_mock_total_heap = 300 * 1024;

uint32_t mock_time_ms() {
  return g_mock_time_ms;
}

uint32_t mock_random() {
  return g_mock_rng();
}

void set_mock_time_ms(uint32_t t) {
  g_mock_time_ms = t;
}

void advance_mock_time_ms(uint32_t delta) {
  g_mock_time_ms += delta;
}

void set_mock_random_seed(uint32_t seed) {
  g_mock_random_seed = seed;
  g_mock_rng.seed(seed);
}

void set_mock_heap_sizes(uint32_t free_bytes, uint32_t total_bytes) {
  g_mock_free_heap = free_bytes;
  g_mock_total_heap = total_bytes;
}

uint32_t mock_free_heap() { return g_mock_free_heap; }
uint32_t mock_total_heap() { return g_mock_total_heap; }

void reset_mock_state() {
  g_mock_time_ms = 0;
  g_mock_random_seed = 12345;
  g_mock_rng.seed(g_mock_random_seed);
  g_mock_free_heap = 200 * 1024;
  g_mock_total_heap = 300 * 1024;
}

}  // namespace test

// Definitions for the esp_heap_caps.h mock.
size_t heap_caps_get_total_size(uint32_t) { return test::mock_total_heap(); }
size_t heap_caps_get_largest_free_block(uint32_t) { return test::mock_free_heap(); }
uint32_t esp_get_free_heap_size(void) { return test::mock_free_heap(); }

