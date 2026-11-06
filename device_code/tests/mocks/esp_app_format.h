#pragma once

// Host stub for <esp_app_format.h>: the image header the leaf checks before it
// writes the first OTA chunk. Only the magic byte is inspected by the receiver,
// which has its own copy of the constant.

#define ESP_IMAGE_HEADER_MAGIC 0xE9
