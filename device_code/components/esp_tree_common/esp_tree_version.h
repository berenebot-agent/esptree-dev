#pragma once

// The ESP Tree firmware version, as reported by every node in its identity push.
//
// This is the add-on release the component sources shipped in - it is bumped by the
// release tooling together with config.yaml, and a unit test fails when the two
// disagree.
//
// It has to be a compile-time constant here because ESPHome gives a project-less
// image no version of its own: `ESPHOME_PROJECT_VERSION` is only defined when the
// YAML carries an `esphome: project:` block, and the app descriptor's `version`
// field is left at the *toolchain* version (2026.6.5), which says nothing about
// what a node is running. Without this fallback a node reports an empty version and
// the UI's Firmware column has nothing to show.
#define ESP_TREE_VERSION "0.1.364"
