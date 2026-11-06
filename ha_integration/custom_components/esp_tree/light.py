from __future__ import annotations

import json

from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_COLOR_MODE,
    ATTR_COLOR_TEMP_KELVIN,
    ATTR_EFFECT,
    ATTR_RGB_COLOR,
    ATTR_TRANSITION,
    ATTR_WHITE,
    ColorMode,
    LightEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .bridge_runtime import get_runtime
from .device_model import EntityModel
from .entity_model import EspTreeEntity

_COLOR_MODE_MAP = {
    "onoff": ColorMode.ONOFF,
    "brightness": ColorMode.BRIGHTNESS,
    "white": ColorMode.WHITE,
    "color_temp": ColorMode.COLOR_TEMP,
    "rgb": ColorMode.RGB,
    "rgbw": ColorMode.RGBW,
    "rgbww": ColorMode.RGBWW,
    "xy": ColorMode.XY,
}


def kelvin_to_mireds(kelvin: float) -> int:
    """HA speaks Kelvin; the bridge payload and the firmware use mireds."""
    if not kelvin or kelvin <= 0:
        return 0
    return int(round(1_000_000 / kelvin))


def mireds_to_kelvin(mireds: float | int | None) -> int | None:
    if not mireds or mireds <= 0:
        return None
    return int(round(1_000_000 / mireds))


def _parse_options(raw: str) -> dict:
    result: dict = {"color_modes": [], "effects": [], "min_mireds": None, "max_mireds": None}
    for part in raw.split(";"):
        if "=" not in part:
            continue
        k, v = part.split("=", 1)
        if k == "color_modes":
            result["color_modes"] = [m.strip() for m in v.replace(",", "|").split("|") if m.strip()]
        elif k == "effects":
            result["effects"] = [e.strip() for e in v.replace(",", "|").split("|") if e.strip()]
        elif k == "min_mireds":
            try:
                result["min_mireds"] = int(v)
            except ValueError:
                pass
        elif k == "max_mireds":
            try:
                result["max_mireds"] = int(v)
            except ValueError:
                pass
    return result


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities) -> None:
    if entry.data.get("type") != "remote":
        return

    seen: set[str] = set()

    def add(model: EntityModel) -> None:
        if model.unique_id in seen:
            return
        seen.add(model.unique_id)
        async_add_entities([EspTreeLight(model)])

    get_runtime(hass).register_platform("light", add, entry.entry_id)


class EspTreeLight(EspTreeEntity, LightEntity):
    def __init__(self, model: EntityModel) -> None:
        super().__init__(model)
        opts = _parse_options(model.options_json)
        self._color_modes = [_COLOR_MODE_MAP.get(m, ColorMode.ONOFF) for m in opts["color_modes"]]
        self._effect_list = opts["effects"] or None
        self._min_mireds = opts["min_mireds"]
        self._max_mireds = opts["max_mireds"]
        self._state = False
        self._brightness = 0
        self._color_mode: ColorMode | None = None
        self._rgb: tuple[int, int, int] | None = None
        self._color_temp: int | None = None
        self._white: int | None = None
        self._effect: str | None = None
        self._apply_model_value()

    @property
    def is_on(self) -> bool:
        return self._state

    @property
    def brightness(self):
        return self._brightness

    @property
    def color_mode(self):
        return self._color_mode

    @property
    def supported_color_modes(self) -> set[ColorMode]:
        return set(self._color_modes) if self._color_modes else {ColorMode.ONOFF}

    @property
    def rgb_color(self):
        return self._rgb

    @property
    def color_temp(self):
        return self._color_temp

    @property
    def color_temp_kelvin(self) -> int | None:
        return mireds_to_kelvin(self._color_temp)

    @property
    def min_mireds(self):
        return self._min_mireds or 153

    @property
    def max_mireds(self):
        return self._max_mireds or 500

    @property
    def min_color_temp_kelvin(self) -> int:
        return mireds_to_kelvin(self.max_mireds) or 2000

    @property
    def max_color_temp_kelvin(self) -> int:
        return mireds_to_kelvin(self.min_mireds) or 6500

    @property
    def effect(self):
        return self._effect

    @property
    def effect_list(self):
        return self._effect_list

    async def async_added_to_hass(self) -> None:
        runtime = get_runtime(self.hass)
        self.async_on_remove(
            runtime.subscribe_entity(self.model.remote_mac, self.model.object_id, self._process_state)
        )
        # A model that already holds a value was never replayed to the entity, so a
        # light that was on at setup reported off until its next state event.
        self._process_state()

    def _apply_model_value(self) -> None:
        raw = self.model.value
        if isinstance(raw, str):
            try:
                data = json.loads(raw)
                state = data.get("state")
                self._state = bool(state) if state is not None else False
                cm = data.get("color_mode")
                self._color_mode = _COLOR_MODE_MAP.get(cm) if cm else None
                self._brightness = data.get("brightness", 0)
                color = data.get("color")
                self._rgb = (color["r"], color["g"], color["b"]) if color else None
                self._color_temp = data.get("color_temp")
                self._white = data.get("white")
                self._effect = data.get("effect")
            except (json.JSONDecodeError, KeyError, TypeError):
                self._state = bool(raw)
        elif isinstance(raw, (bool, int)):
            self._state = bool(raw)

    def _process_state(self) -> None:
        self._apply_model_value()
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs) -> None:
        payload: dict = {"state": "ON"}
        # The bridge seeds the bytes this payload omits from the last known state,
        # so only send what actually changed. Brightness is the exception: ESPHome's
        # own turn_on default is full brightness, and leaving the field out of a
        # first-ever turn-on would keep whatever the zero-initialised byte held.
        brightness = kwargs.get(ATTR_BRIGHTNESS, self._brightness)
        if not brightness:
            brightness = 255
        payload["brightness"] = brightness
        if ATTR_COLOR_MODE in kwargs:
            payload["color_mode"] = kwargs[ATTR_COLOR_MODE]
        if ATTR_RGB_COLOR in kwargs:
            r, g, b = kwargs[ATTR_RGB_COLOR]
            payload["color"] = {"r": r, "g": g, "b": b}
        if ATTR_COLOR_TEMP_KELVIN in kwargs:
            payload["color_temp"] = kelvin_to_mireds(kwargs[ATTR_COLOR_TEMP_KELVIN])
        if ATTR_WHITE in kwargs:
            payload["white"] = kwargs[ATTR_WHITE]
        if ATTR_EFFECT in kwargs:
            payload["effect"] = kwargs[ATTR_EFFECT]
        if ATTR_TRANSITION in kwargs:
            payload["transition"] = kwargs[ATTR_TRANSITION]
        await get_runtime(self.hass).send_command(
            self.model.remote_mac, self.model.object_id, "turn_on",
            payload=json.dumps(payload),
        )

    async def async_turn_off(self, **kwargs) -> None:
        payload: dict = {"state": "OFF"}
        if ATTR_TRANSITION in kwargs:
            payload["transition"] = kwargs[ATTR_TRANSITION]
        await get_runtime(self.hass).send_command(
            self.model.remote_mac, self.model.object_id, "turn_off",
            payload=json.dumps(payload),
        )