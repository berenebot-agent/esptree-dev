"""Serial bridge hardening: keepalive, port handling, frame ordering, scaffold.

Each test pins one fix from the serial-bridge review:

* keepalive must fire when the add-on has been quiet, even while the bridge is
  chatty (the bridge's 60s timeout counts what IT receives);
* a saved /dev/ttyUSBn is upgraded to its stable /dev/serial/by-id alias, and the
  client never rewrites its own target;
* DTR/RTS stay deasserted across open so auto-reset boards don't reboot;
* frames after auth_ok are held until the session is live, then delivered in
  order;
* ClientHello is re-sent when the first challenge is lost to boot noise;
* the serial scaffold keeps the logger off the data UART; usb_cdc is rejected.
"""
from __future__ import annotations

import asyncio
import time
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest
import yaml

pytest.importorskip("google.protobuf")
pytest.importorskip("serial")

from app import bridge_serial_client as serial_client  # noqa: E402
from app.models import BridgeTarget  # noqa: E402
from app.protobuf.generated import esp_tree_runtime_pb2 as pb  # noqa: E402
from app.serial_ports import stable_serial_path  # noqa: E402
from app.yaml_scaffold import CHIP_NAME_TO_BOARD, generate_scaffold  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[2]


def _client(port: str = "/dev/null") -> serial_client.SerialBridgeClient:
    return serial_client.SerialBridgeClient(
        "bridge-1",
        BridgeTarget(host="", transport="serial", serial_port=port, api_key="test-api-key"),
        on_frame=AsyncMock(),
        on_connection_change=AsyncMock(),
    )


# --- keepalive -------------------------------------------------------------


@pytest.mark.asyncio
async def test_keepalive_pings_when_we_are_quiet_even_if_bridge_is_chatty(monkeypatch) -> None:
    client = _client()
    ticks = {"n": 0}

    async def fake_sleep(_):
        # Bounded: a client that only watches received data would never ping
        # here, and must not be allowed to wait out the real 20s instead.
        ticks["n"] += 1
        client._last_data_time = time.monotonic()  # bridge keeps chattering
        if ticks["n"] > 3:
            client._stop_event.set()

    monkeypatch.setattr(serial_client.asyncio, "sleep", fake_sleep)
    client._connected = True
    client._last_send_time = time.monotonic() - serial_client.KEEPALIVE_INTERVAL_S - 1  # we have not

    async def fake_request(env, timeout):
        client._stop_event.set()
        return pb.Envelope(pong=pb.Pong())

    client.request = AsyncMock(side_effect=fake_request)  # type: ignore[method-assign]
    await client._keepalive_loop()

    client.request.assert_awaited_once()
    assert client.request.await_args.args[0].WhichOneof("msg") == "ping"


@pytest.mark.asyncio
async def test_keepalive_stays_quiet_when_both_directions_are_active(monkeypatch) -> None:
    ticks = {"n": 0}
    client = _client()

    async def fake_sleep(_):
        ticks["n"] += 1
        if ticks["n"] > 3:
            client._stop_event.set()

    monkeypatch.setattr(serial_client.asyncio, "sleep", fake_sleep)
    client._connected = True
    client._last_data_time = client._last_send_time = time.monotonic()
    client.request = AsyncMock()  # type: ignore[method-assign]

    await client._keepalive_loop()

    client.request.assert_not_awaited()


def test_sending_refreshes_the_send_clock() -> None:
    client = _client()
    client._serial = MagicMock(is_open=True)
    client._last_send_time = 0.0
    client._send_envelope_sync(pb.Envelope(ping=pb.Ping()))
    assert client._last_send_time > 0.0


# --- port paths ------------------------------------------------------------


def _dev_with_by_id(tmp_path: Path) -> tuple[Path, Path, Path]:
    dev = tmp_path / "dev"
    dev.mkdir()
    tty = dev / "ttyUSB0"
    tty.write_text("")
    by_id = dev / "serial" / "by-id"
    by_id.mkdir(parents=True)
    link = by_id / "usb-Silicon_Labs_CP2102_0001-if00-port0"
    link.symlink_to(tty)
    return dev, tty, link


def test_stable_path_upgrades_ttyusb_to_by_id(tmp_path) -> None:
    dev, tty, link = _dev_with_by_id(tmp_path)
    assert stable_serial_path(str(tty), str(dev)) == str(link)


def test_stable_path_leaves_urls_by_id_and_unknown_ports_alone(tmp_path) -> None:
    dev, _tty, link = _dev_with_by_id(tmp_path)
    assert stable_serial_path("socket://10.0.0.5:4000", str(dev)) == "socket://10.0.0.5:4000"
    assert stable_serial_path(str(link), str(dev)) == str(link)
    missing = str(dev / "ttyUSB7")
    assert stable_serial_path(missing, str(dev)) == missing
    assert stable_serial_path("", str(dev)) == ""


def test_resolve_port_never_rewrites_target(monkeypatch) -> None:
    """The manager restarts a client whose target changed; don't mutate it here."""
    monkeypatch.setattr(serial_client.serial.tools.list_ports, "comports", lambda: [])
    client = _client("/dev/ttyUSB9-does-not-exist")
    assert client._resolve_port() is None
    assert client.target.serial_port == "/dev/ttyUSB9-does-not-exist"


# --- open: DTR/RTS + input flush ---------------------------------------------


class _FakeSerial:
    def __init__(self) -> None:
        self.events: list[tuple[str, object]] = []
        self.is_open = False

    def __setattr__(self, name, value):
        if name in ("dtr", "rts"):
            self.events.append((name, value))
        object.__setattr__(self, name, value)

    def open(self) -> None:
        self.events.append(("open", None))
        self.is_open = True

    def reset_input_buffer(self) -> None:
        self.events.append(("reset_input_buffer", None))


def test_local_port_opens_with_dtr_rts_deasserted_and_flushes(monkeypatch) -> None:
    fake = _FakeSerial()
    calls = {}

    def fake_for_url(**kwargs):
        calls.update(kwargs)
        return fake

    monkeypatch.setattr(serial_client.serial, "serial_for_url", fake_for_url)
    client = _client("/dev/null")
    client._connect_once()

    assert calls.get("do_not_open") is True
    names = [e[0] for e in fake.events]
    assert names.index("dtr") < names.index("open")
    assert names.index("rts") < names.index("open")
    assert ("dtr", False) in fake.events and ("rts", False) in fake.events
    assert names.index("reset_input_buffer") > names.index("open")


def test_socket_url_does_not_touch_modem_lines(monkeypatch) -> None:
    fake = _FakeSerial()
    monkeypatch.setattr(serial_client.serial, "serial_for_url", lambda **kw: fake)
    client = _client("socket://10.0.0.5:4000")
    client._connect_once()
    names = [e[0] for e in fake.events]
    assert "dtr" not in names and "rts" not in names
    assert "open" in names


# --- frame ordering around auth -------------------------------------------


@pytest.mark.asyncio
async def test_frames_after_auth_ok_wait_for_go_live_and_keep_order() -> None:
    client = _client()
    client._loop = asyncio.get_running_loop()
    client._auth_ok_future = client._loop.create_future()
    dispatched: list[str] = []
    client._dispatch_frame = lambda env, raw: dispatched.append(env.request_id)  # type: ignore[method-assign]

    client._route_frame(pb.Envelope(request_id="ok", auth_ok=pb.AuthOk()), b"")
    assert client._auth_ok_future.done()
    # Snapshot lands before the auth coroutine has resumed / gone live.
    client._route_frame(pb.Envelope(request_id="snap", full_snapshot=pb.FullSnapshot()), b"")
    client._auth_ok_future = None
    client._connected = True
    # ...and an event lands while on_connection_change(True) is still running.
    client._route_frame(pb.Envelope(request_id="evt", pong=pb.Pong()), b"")
    assert dispatched == [], "nothing may be dispatched before the session is live"

    # Go live the way _run_auth does.
    pending, client._auth_pending_frames = client._auth_pending_frames, []
    for env, raw in pending:
        client._dispatch_frame(env, raw)
    client._session_ready = True
    client._route_frame(pb.Envelope(request_id="later", pong=pb.Pong()), b"")

    assert dispatched == ["snap", "evt", "later"]


@pytest.mark.asyncio
async def test_unauthenticated_frames_before_challenge_are_dropped() -> None:
    client = _client()
    loop = asyncio.get_running_loop()
    client._loop = loop
    client._auth_challenge_future = loop.create_future()
    client._auth_ok_future = loop.create_future()
    client._dispatch_frame = MagicMock()  # type: ignore[method-assign]

    client._route_frame(pb.Envelope(full_snapshot=pb.FullSnapshot()), b"")
    client._route_frame(pb.Envelope(auth_ok=pb.AuthOk()), b"")

    assert not client._auth_challenge_future.done()
    assert not client._auth_ok_future.done(), "auth_ok before the challenge is not proof of auth"
    assert client._auth_pending_frames == []
    client._dispatch_frame.assert_not_called()


# --- ClientHello retry ------------------------------------------------------


@pytest.mark.asyncio
async def test_client_hello_is_resent_when_first_challenge_is_lost(monkeypatch) -> None:
    monkeypatch.setattr(serial_client, "HELLO_RETRY_WAITS_S", (0.05, 0.05, 0.05))
    client = _client()
    client._loop = asyncio.get_running_loop()
    client._read_loop = lambda: None  # type: ignore[method-assign]
    hellos: list[str] = []

    def fake_send(env: pb.Envelope) -> None:
        kind = env.WhichOneof("msg")
        if kind == "client_hello":
            hellos.append(env.request_id)
            if len(hellos) == 2:  # first challenge "lost" to boot noise
                client._loop.call_soon(
                    client._route_frame,
                    pb.Envelope(auth_challenge=pb.AuthChallenge(server_nonce=b"\x01" * 16)),
                    b"",
                )
        elif kind == "auth_response":
            client._loop.call_soon(client._route_frame, pb.Envelope(auth_failed=pb.AuthFailed(code="x")), b"")

    client._send_envelope_sync = fake_send  # type: ignore[method-assign]

    with pytest.raises(RuntimeError, match="x"):
        await client._run_auth()  # stops at auth_failed; we only care about the hellos
    assert len(hellos) == 2


@pytest.mark.asyncio
async def test_challenge_timeout_still_reported_after_all_retries(monkeypatch) -> None:
    monkeypatch.setattr(serial_client, "HELLO_RETRY_WAITS_S", (0.01, 0.01))
    client = _client()
    client._loop = asyncio.get_running_loop()
    client._read_loop = lambda: None  # type: ignore[method-assign]
    sent: list[str] = []
    client._send_envelope_sync = lambda env: sent.append(env.WhichOneof("msg"))  # type: ignore[method-assign]

    with pytest.raises(RuntimeError, match="timeout waiting for auth_challenge"):
        await client._run_auth()
    assert sent == ["client_hello", "client_hello"]
    assert client._auth_ok_future is None and client._auth_challenge_future is None


# --- scaffold / component config -------------------------------------------


def _serial_bridge_scaffold(chip: str = "ESP32-C5") -> dict:
    node = {
        "esphome_name": "esp-tree-bridge-serial",
        "is_bridge": True,
        "chip_name": chip,
        "board_info": dict(CHIP_NAME_TO_BOARD[chip]),
        "api_key": "!secret bridge_api_key",
        "transport": "serial",
    }
    content, _ = generate_scaffold(node)

    class _Loader(yaml.SafeLoader):
        pass

    _Loader.add_constructor("!secret", lambda loader, n: f"!secret {loader.construct_scalar(n)}")
    return yaml.load(content, Loader=_Loader)


def test_serial_scaffold_keeps_logger_off_the_data_uart() -> None:
    cfg = _serial_bridge_scaffold()
    assert cfg["logger"]["baud_rate"] == 0
    assert cfg["uart"][0]["baud_rate"] == 460800
    assert cfg["esp_tree_bridge"]["serial_transport"]["uart_id"] == "bridge_uart"


def test_serial_scaffold_refuses_esp32h2() -> None:
    with pytest.raises(ValueError, match="no UART0 pins"):
        _serial_bridge_scaffold("ESP32-H2")


def test_usb_cdc_is_rejected_not_silently_ignored() -> None:
    src = (REPO_ROOT / "device_code/components/esp_tree_bridge/__init__.py").read_text()
    assert "-DUSE_USB_CDC" not in src
    assert "cv.Optional(CONF_USB_CDC): cv.invalid(" in src
