set(TREE_COMPONENTS "${CMAKE_CURRENT_LIST_DIR}/../../components")
set(TREE_BRIDGE "${TREE_COMPONENTS}/esp_tree_bridge")
set(TREE_COMMON "${TREE_COMPONENTS}/esp_tree_common")

# Use the same protocol / OTA / protobuf code for every ESP32 target.
# No ESPHome firmware or Home Assistant source files are modified.
idf_component_register(
    SRCS
      "main.cpp"
      "${TREE_BRIDGE}/esp_tree_bridge.cpp"
      "${TREE_BRIDGE}/bridge_protocol.cpp"
      "${TREE_BRIDGE}/bridge_ota_manager.cpp"
      "${TREE_BRIDGE}/bridge_api_serial.cpp"
      "${TREE_BRIDGE}/bridge_api_auth.cpp"
      "${TREE_BRIDGE}/bridge_api_proto_messages.cpp"
      "${TREE_BRIDGE}/bridge_json_utils.cpp"
      "${TREE_COMMON}/espnow_crypto.cpp"
    INCLUDE_DIRS
      "." "compat" "${TREE_COMPONENTS}" "${TREE_BRIDGE}"
    REQUIRES
      esp_wifi esp_event esp_netif esp_timer esp_driver_uart
      nvs_flash mbedtls json
)
target_compile_definitions(${COMPONENT_LIB} PRIVATE USE_SERIAL=1)
target_compile_features(${COMPONENT_LIB} PRIVATE cxx_std_17)
