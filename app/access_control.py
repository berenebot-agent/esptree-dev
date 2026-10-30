"""Restrict the add-on's unauthenticated UI/API to trusted Home Assistant peers.

Ingress authenticates users *at the Supervisor*, but a host-network add-on is
otherwise accessible on the LAN. Never trust X-Ingress-Path / X-Forwarded-For:
those headers are caller-controlled outside the Supervisor.
"""
from __future__ import annotations

import ipaddress
import logging
import os
from typing import Any

from starlette.responses import JSONResponse

_LOCAL_PEERS = frozenset({"127.0.0.1", "::1"})
# Home Assistant's internal bridge gateway (Core / local host) and its
# authenticated Supervisor ingress proxy, respectively.
_ADDON_PEERS = frozenset({"172.30.32.1", "172.30.32.2"})


def trusted_peers(supervisor_token: str) -> frozenset[str]:
    """Only exact socket peer IPs, never a user-supplied HTTP header or subnet."""
    peers = set(_LOCAL_PEERS)
    if supervisor_token:
        peers.update(_ADDON_PEERS)

    # Deliberate opt-in for the standalone developer harness on another machine.
    # Exact IPs only; CIDR ranges and wildcards are rejected. Not an add-on option.
    for raw in os.environ.get("ESP_TREE_TRUSTED_PEERS", "").split(","):
        candidate = raw.strip()
        if not candidate:
            continue
        addr = ipaddress.ip_address(candidate)
        if addr.is_unspecified or addr.is_multicast:
            raise ValueError("ESP_TREE_TRUSTED_PEERS must contain unicast IP addresses")
        peers.add(str(addr))
    return frozenset(peers)


def is_trusted_peer(client: Any, peers: frozenset[str]) -> bool:
    if not isinstance(client, (tuple, list)) or not client:
        return False
    try:
        address = ipaddress.ip_address(str(client[0]))
    except ValueError:
        return False
    if isinstance(address, ipaddress.IPv6Address) and address.ipv4_mapped:
        address = address.ipv4_mapped
    return str(address) in peers


class TrustedPeerMiddleware:
    """Reject unauthorised HTTP *and* WebSocket requests before routing.

    The integration's protobuf WebSocket keeps its own token authentication.
    This gate ensures that neither it nor the unauthenticated topology stream
    can be reached directly from the LAN.
    """

    def __init__(self, app: Any, peers: frozenset[str]):
        self.app = app
        self.peers = peers

    async def __call__(self, scope: dict[str, Any], receive: Any, send: Any) -> None:
        kind = scope["type"]
        if kind not in {"http", "websocket"}:
            await self.app(scope, receive, send)
            return
        if is_trusted_peer(scope.get("client"), self.peers):
            await self.app(scope, receive, send)
            return

        if kind == "websocket":
            await send({"type": "websocket.close", "code": 1008, "reason": "Use Home Assistant ingress"})
        else:
            response = JSONResponse(
                {"detail": "Direct ESP Tree access is disabled. Use Home Assistant ingress."},
                status_code=403,
            )
            await response(scope, receive, send)
