# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Home Assistant users who install, configure, and maintain ESP-NOW device networks. They range from first-time setup users to technically experienced operators running firmware and recovery workflows, often inside the Home Assistant add-on panel on desktop or mobile.

## Product Purpose

ESP Tree is the management plane for an ESP-NOW network of ESPHome-style sensor and actuator nodes. It helps users connect a bridge, understand network and device health, add and configure remotes, compile and deploy firmware, monitor jobs, and recover from failures. Success means users can operate the network confidently without manually coordinating bridge, firmware, queue, and Home Assistant integration state.

## Positioning

ESP Tree combines ESP-NOW mesh operations, ESPHome firmware lifecycle management, and Home Assistant integration in one add-on. Unlike a generic device dashboard, it understands bridge/remotes/relays, route hops, retained offline nodes, OTA rejoin confirmation, compile queues, and Home Assistant setup state.

## Operating Context

The primary context is authenticated Home Assistant ingress, with a standalone development harness for UI testing. Important journeys are first-run bridge and integration setup; assessing topology and device health; creating and configuring remotes; compiling, flashing, and updating firmware; monitoring compile/OTA queues and logs; managing secrets and stored bridges; and diagnosing offline devices or failed jobs. Browser USB flashing requires Chrome or Edge over HTTPS. Hardware operations can be long-running and may temporarily take the mesh offline.

## Capabilities and Constraints

- Preserve the Lit/Vite frontend and existing FastAPI/API, WebSocket, firmware, and Home Assistant behavior.
- Show one active bridge while allowing multiple stored bridge records.
- Keep topology, device detail/configuration, setup and remote wizards, queues, job history, activity logs, settings, and secrets available.
- Treat offline and retained nodes, loading, disconnected add-on/bridge states, failed jobs, destructive removal, and firmware recovery as first-class states.
- Do not hide technical capability merely to simplify the interface; progressively disclose advanced detail where it improves frequent workflows.
- Browser-based USB flashing has browser and secure-context limitations; add-on-side serial flashing and downloads remain relevant alternatives.

## Brand Commitments

The product name is ESP Tree (rendered in parts of the incumbent UI as ESP-Tree). Existing logo and icon assets are available at `logo.png` and `icon.png`. The existing product promise “Go where WiFi won't” is incumbent copy, not a requirement to preserve its presentation.

## Evidence on Hand

Real product and workflow documentation is in `README.md`, `docs/`, and the executable backend/frontend. Real device, bridge, queue, and integration states come from the application APIs and standalone harness. No testimonials, customer claims, performance benchmarks, or commercial proof are supplied or should be invented.

## Product Principles

- Make network health and the next useful action obvious before exposing configuration depth.
- Match the mental model of bridge, remotes, relays, firmware, and jobs rather than generic dashboard conventions.
- Preserve operational control and make risky or disruptive consequences explicit.
- Design for recovery: disconnected, empty, offline, queued, failed, and long-running states are normal product states.
- Keep setup approachable without reducing expert diagnostic and firmware capabilities.

## Accessibility & Inclusion

The redesign must support keyboard operation, visible focus, readable contrast, responsive desktop/tablet/mobile layouts, meaningful status text beyond color, and usable touch targets. These are delivery requirements for this work; no stricter product-specific conformance certification has been established.
