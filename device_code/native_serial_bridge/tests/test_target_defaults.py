"""Ensure native per-chip UART pins stay aligned with ESP Tree's board map."""

import ast
import re
import unittest
from pathlib import Path


NATIVE = Path(__file__).resolve().parents[1]
REPO = NATIVE.parents[1]
SUPPORTED = ("esp32", "esp32s2", "esp32s3", "esp32c2",
             "esp32c3", "esp32c5", "esp32c6")


def scaffold_uart_map():
    tree = ast.parse((REPO / "app/yaml_scaffold.py").read_text())
    for stmt in tree.body:
        if isinstance(stmt, ast.AnnAssign) and isinstance(stmt.target, ast.Name):
            if stmt.target.id == "UART0_PINS_BY_VARIANT":
                return ast.literal_eval(stmt.value)
    raise AssertionError("UART0_PINS_BY_VARIANT not found in scaffold")


def kconfig_defaults(name):
    source = (NATIVE / "main/Kconfig.projbuild").read_text()
    match = re.search(r"^    config " + name + r"\n(.*?)(?=^    config |^endmenu)",
                      source, re.M | re.S)
    if not match:
        raise AssertionError(f"Kconfig option {name} not found")
    result = {}
    for value, condition in re.findall(r"^\s+default (\d+) if (.*)$", match.group(1), re.M):
        for target in SUPPORTED:
            # Match a complete Kconfig IDF_TARGET symbol; avoid esp32/c3
            # substring collisions.
            names = re.findall(r"IDF_TARGET_([A-Z0-9]+)", condition)
            if target.upper() in names:
                if target in result:
                    raise AssertionError(f"duplicate {name} default for {target}")
                result[target] = int(value)
    return result


class NativeTargetTests(unittest.TestCase):
    def test_uart0_pins_match_existing_esptree_board_map(self):
        pins = scaffold_uart_map()
        tx = kconfig_defaults("ESP_TREE_UART_TX_GPIO")
        rx = kconfig_defaults("ESP_TREE_UART_RX_GPIO")
        self.assertEqual(set(SUPPORTED), set(tx))
        self.assertEqual(set(SUPPORTED), set(rx))
        for target in SUPPORTED:
            with self.subTest(target=target):
                self.assertEqual((tx[target], rx[target]), pins[target])

    def test_build_does_not_implicitly_select_c5(self):
        script = (NATIVE / "build.sh").read_text()
        self.assertNotIn("idf.py set-target esp32c5", script)
        self.assertIn('idf.py set-target "$requested"', script)
        self.assertIn("Refusing to reset", script)


if __name__ == "__main__":
    unittest.main()
