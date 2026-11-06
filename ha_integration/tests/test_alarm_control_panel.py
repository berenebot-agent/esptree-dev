"""Tests for alarm_control_panel entity."""
from __future__ import annotations

import json

import pytest
from unittest.mock import MagicMock

from tests.conftest import EntityModel, MockRuntime, import_entity

alarm_mod = import_entity("alarm_control_panel")
EspTreeAlarmControlPanel = alarm_mod.EspTreeAlarmControlPanel
_parse_features = alarm_mod._parse_features
AlarmControlPanelState = alarm_mod.AlarmControlPanelState
AlarmControlPanelEntityFeature = alarm_mod.AlarmControlPanelEntityFeature
CodeFormat = alarm_mod.CodeFormat


class TestParseFeatures:
    def test_empty(self):
        features = _parse_features("")
        assert features == AlarmControlPanelEntityFeature(0)

    def test_arm_home(self):
        assert AlarmControlPanelEntityFeature.ARM_HOME in _parse_features("features=1")

    def test_arm_away(self):
        assert AlarmControlPanelEntityFeature.ARM_AWAY in _parse_features("features=2")

    def test_arm_night(self):
        assert AlarmControlPanelEntityFeature.ARM_NIGHT in _parse_features("features=4")

    def test_trigger(self):
        assert AlarmControlPanelEntityFeature.TRIGGER in _parse_features("features=8")

    def test_arm_custom_bypass(self):
        assert AlarmControlPanelEntityFeature.ARM_CUSTOM_BYPASS in _parse_features("features=16")

    def test_arm_vacation(self):
        assert AlarmControlPanelEntityFeature.ARM_VACATION in _parse_features("features=32")

    def test_all(self):
        features = _parse_features("features=63")
        for f in [AlarmControlPanelEntityFeature.ARM_HOME, AlarmControlPanelEntityFeature.ARM_AWAY,
                  AlarmControlPanelEntityFeature.ARM_NIGHT, AlarmControlPanelEntityFeature.TRIGGER,
                  AlarmControlPanelEntityFeature.ARM_CUSTOM_BYPASS, AlarmControlPanelEntityFeature.ARM_VACATION]:
            assert f in features


class TestEspTreeAlarmControlPanel:
    def _make(self, options_json="", value=None):
        runtime = MockRuntime()
        model = EntityModel(options_json=options_json, value=value, platform="alarm_control_panel")
        entity = EspTreeAlarmControlPanel(model)
        hass = MagicMock()
        hass.data = {"esp_tree": {"runtime": runtime}}
        entity.hass = hass
        return entity, runtime

    def test_default_state_is_unknown(self):
        # An unread panel was previously reported as DISARMED, which is a claim.
        entity, _ = self._make()
        assert entity.alarm_state is None

    def test_process_state_armed_home(self):
        entity, _ = self._make()
        entity.model.value = "armed_home"
        entity._process_state()
        assert entity.alarm_state == AlarmControlPanelState.ARMED_HOME

    def test_process_state_triggered(self):
        entity, _ = self._make()
        entity.model.value = "triggered"
        entity._process_state()
        assert entity.alarm_state == AlarmControlPanelState.TRIGGERED

    def test_process_state_pending(self):
        entity, _ = self._make()
        entity.model.value = "pending"
        entity._process_state()
        assert entity.alarm_state == AlarmControlPanelState.PENDING

    def test_process_state_unknown_is_not_disarmed(self):
        entity, _ = self._make()
        entity.model.value = "unknown_state"
        entity._process_state()
        assert entity.alarm_state is None

    def test_state_populated_before_construction_is_applied(self):
        entity, _ = self._make(value="armed_away")
        assert entity.alarm_state == AlarmControlPanelState.ARMED_AWAY

    def test_code_format_number(self):
        entity, _ = self._make("requires_code=1")
        assert entity.code_format == CodeFormat.NUMBER

    def test_code_format_none(self):
        entity, _ = self._make()
        assert entity.code_format is None

    @pytest.mark.asyncio
    async def test_async_alarm_arm_home(self):
        entity, runtime = self._make()
        await entity.async_alarm_arm_home()
        assert runtime._commands[0][2] == "arm_home"
        assert json.loads(runtime._commands[0][3]["payload"]) == {"state": "ARM_HOME"}

    @pytest.mark.asyncio
    async def test_async_alarm_arm_away(self):
        entity, runtime = self._make()
        await entity.async_alarm_arm_away()
        assert runtime._commands[0][2] == "arm_away"
        assert json.loads(runtime._commands[0][3]["payload"]) == {"state": "ARM_AWAY"}

    @pytest.mark.asyncio
    async def test_async_alarm_arm_night(self):
        entity, runtime = self._make()
        await entity.async_alarm_arm_night()
        assert runtime._commands[0][2] == "arm_night"
        assert json.loads(runtime._commands[0][3]["payload"]) == {"state": "ARM_NIGHT"}

    @pytest.mark.asyncio
    async def test_async_alarm_arm_vacation(self):
        entity, runtime = self._make()
        await entity.async_alarm_arm_vacation()
        assert runtime._commands[0][2] == "arm_vacation"
        assert json.loads(runtime._commands[0][3]["payload"]) == {"state": "ARM_VACATION"}

    @pytest.mark.asyncio
    async def test_async_alarm_arm_custom_bypass(self):
        entity, runtime = self._make()
        await entity.async_alarm_arm_custom_bypass()
        assert runtime._commands[0][2] == "arm_custom_bypass"
        assert json.loads(runtime._commands[0][3]["payload"]) == {"state": "ARM_CUSTOM_BYPASS"}

    @pytest.mark.asyncio
    async def test_async_alarm_disarm(self):
        entity, runtime = self._make()
        await entity.async_alarm_disarm()
        assert runtime._commands[0][2] == "disarm"
        assert json.loads(runtime._commands[0][3]["payload"]) == {"state": "DISARM"}

    @pytest.mark.asyncio
    async def test_async_alarm_trigger(self):
        entity, runtime = self._make()
        await entity.async_alarm_trigger()
        assert runtime._commands[0][2] == "triggered"
        assert json.loads(runtime._commands[0][3]["payload"]) == {"state": "TRIGGERED"}

    @pytest.mark.asyncio
    async def test_disarm_forwards_the_code(self):
        # The firmware parses {"state","code"} and calls set_code(); dropping the
        # code made every protected panel unusable.
        entity, runtime = self._make("requires_code=1")
        await entity.async_alarm_disarm(code="1234")
        payload = json.loads(runtime._commands[0][3]["payload"])
        assert payload == {"state": "DISARM", "code": "1234"}

    @pytest.mark.asyncio
    async def test_arm_without_code_omits_the_field(self):
        entity, runtime = self._make()
        await entity.async_alarm_arm_away()
        payload = json.loads(runtime._commands[0][3]["payload"])
        assert "code" not in payload