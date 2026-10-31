"""Host-network guard for all HTTP, REST and WebSocket endpoints."""
import asyncio

import pytest

from app.access_control import TrustedPeerMiddleware, is_trusted_peer, trusted_peers


def _run_request(kind: str, ip: str | None, peers: frozenset[str], headers=()):
    sent = []
    reached = []

    async def downstream(scope, receive, send):
        reached.append(scope["type"])

    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(message):
        sent.append(message)

    scope = {"type": kind, "path": "/api/secrets", "headers": list(headers),
             "method": "GET", "client": (ip, 12345) if ip is not None else None}
    asyncio.run(TrustedPeerMiddleware(downstream, peers)(scope, receive, send))
    return sent, reached


@pytest.mark.parametrize("kind", ["http", "websocket"])
@pytest.mark.parametrize("ip", ["192.168.1.20", "10.0.0.42", "172.30.33.5", None])
def test_direct_clients_denied(kind, ip):
    messages, reached = _run_request(kind, ip, trusted_peers("fake-supervisor-token"))
    assert reached == []
    assert messages[0]["type"] == ("http.response.start" if kind == "http" else "websocket.close")
    assert messages[0].get("status", messages[0].get("code")) == (403 if kind == "http" else 1008)


@pytest.mark.parametrize("kind", ["http", "websocket"])
@pytest.mark.parametrize("ip", ["127.0.0.1", "::1", "172.30.32.1", "172.30.32.2", "::ffff:172.30.32.2"])
def test_ha_trusted_clients_allowed(kind, ip):
    messages, reached = _run_request(kind, ip, trusted_peers("fake-supervisor-token"))
    assert reached == [kind]
    assert messages == []


def test_caller_supplied_headers_cannot_grant_access():
    messages, reached = _run_request("http", "192.168.1.20", trusted_peers("token"), headers=[
        (b"x-ingress-path", b"/api/hassio_ingress/fake"),
        (b"x-forwarded-for", b"172.30.32.2"),
    ])
    assert reached == []
    assert messages[0]["status"] == 403


def test_standalone_default_only_allows_loopback(monkeypatch):
    monkeypatch.delenv("ESP_TREE_TRUSTED_PEERS", raising=False)
    peers = trusted_peers("")
    assert is_trusted_peer(("127.0.0.1", 5000), peers)
    assert not is_trusted_peer(("172.30.32.2", 5000), peers)


def test_explicit_standalone_peer_whitelist(monkeypatch):
    monkeypatch.setenv("ESP_TREE_TRUSTED_PEERS", "10.0.0.23, 2001:db8::1")
    peers = trusted_peers("")
    assert "10.0.0.23" in peers
    assert "2001:db8::1" in peers
    assert "10.0.0.24" not in peers


@pytest.mark.parametrize("invalid", ["*", "192.168.1.0/24", "0.0.0.0", "::"])
def test_rejects_broad_trust_overrides(monkeypatch, invalid):
    monkeypatch.setenv("ESP_TREE_TRUSTED_PEERS", invalid)
    with pytest.raises(ValueError):
        trusted_peers("token")
