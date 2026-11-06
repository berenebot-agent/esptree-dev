cmake_minimum_required(VERSION 3.16)
project(esp_tree_tests LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

enable_testing()

add_executable(protocol_test protocol_test.cpp)
target_include_directories(protocol_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/mocks ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
target_sources(protocol_test PRIVATE ../components/esp_tree_common/espnow_crypto.cpp)
find_package(OpenSSL REQUIRED)
target_link_libraries(protocol_test PRIVATE OpenSSL::Crypto)
add_test(NAME protocol_test COMMAND protocol_test)

add_executable(heartbeat_parent_mac_test heartbeat_parent_mac_test.cpp)
add_test(NAME heartbeat_parent_mac_test COMMAND heartbeat_parent_mac_test)

add_executable(packet_sizes_test packet_sizes_test.cpp)
target_include_directories(packet_sizes_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME packet_sizes_test COMMAND packet_sizes_test)

add_executable(parse_helpers_test parse_helpers_test.cpp)
target_include_directories(parse_helpers_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME parse_helpers_test COMMAND parse_helpers_test)

add_executable(counter_test counter_test.cpp)
target_include_directories(counter_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME counter_test COMMAND counter_test)

add_executable(fragment_assembly_test fragment_assembly_test.cpp)
target_include_directories(fragment_assembly_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME fragment_assembly_test COMMAND fragment_assembly_test)

add_executable(route_expiry_test route_expiry_test.cpp)
target_include_directories(route_expiry_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME route_expiry_test COMMAND route_expiry_test)

add_executable(join_status_codes_test join_status_codes_test.cpp)
target_include_directories(join_status_codes_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME join_status_codes_test COMMAND join_status_codes_test)

add_executable(state_machine_test state_machine_test.cpp)
target_include_directories(state_machine_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME state_machine_test COMMAND state_machine_test)

add_executable(retry_backoff_test retry_backoff_test.cpp)
target_include_directories(retry_backoff_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME retry_backoff_test COMMAND retry_backoff_test)

add_executable(encryption_test encryption_test.cpp)
target_include_directories(encryption_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
target_sources(encryption_test PRIVATE ../components/esp_tree_common/espnow_crypto.cpp)
find_package(OpenSSL REQUIRED)
target_link_libraries(encryption_test PRIVATE OpenSSL::Crypto)
add_test(NAME encryption_test COMMAND encryption_test)

# Forces the software AES branch that the ESP32/ESP8266 builds use; on a host it
# is otherwise compiled away in favour of OpenSSL, leaving the code the devices
# actually run untested.
add_executable(software_aes_test software_aes_test.cpp)
target_include_directories(software_aes_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
target_sources(software_aes_test PRIVATE ../components/esp_tree_common/espnow_crypto.cpp)
target_compile_definitions(software_aes_test PRIVATE ESPNOW_CRYPTO_SOFTWARE_AES=1)
# espnow_crypto.cpp still uses OpenSSL for HMAC-SHA256 on the host even when the
# AES branch is forced, so the target needs the headers and the library.
find_package(OpenSSL REQUIRED)
target_link_libraries(software_aes_test PRIVATE OpenSSL::Crypto)
add_test(NAME software_aes_test COMMAND software_aes_test)

add_executable(hop_encoding_test hop_encoding_test.cpp)
target_include_directories(hop_encoding_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME hop_encoding_test COMMAND hop_encoding_test)

find_package(OpenSSL REQUIRED)

add_executable(b7b_error_handling_test b7b_error_handling_test.cpp)
target_include_directories(b7b_error_handling_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME b7b_error_handling_test COMMAND b7b_error_handling_test)

add_executable(b7c_boundary_test b7c_boundary_test.cpp)
target_include_directories(b7c_boundary_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME b7c_boundary_test COMMAND b7c_boundary_test)

add_executable(file_receiver_test file_receiver_test.cpp)
target_include_directories(file_receiver_test PRIVATE
  ${CMAKE_CURRENT_LIST_DIR}
  ${CMAKE_CURRENT_LIST_DIR}/mocks
  ${CMAKE_CURRENT_LIST_DIR}/..
  ${CMAKE_CURRENT_LIST_DIR}/../components
)
target_sources(file_receiver_test PRIVATE
  ../components/esp_tree_remote/remote_file_receiver.cpp
  mocks/test_time.cpp
)
find_package(OpenSSL REQUIRED)
target_link_libraries(file_receiver_test PRIVATE OpenSSL::Crypto)
add_test(NAME file_receiver_test COMMAND file_receiver_test)

add_executable(bridge_ota_manager_test bridge_ota_manager_test.cpp)
target_include_directories(bridge_ota_manager_test PRIVATE
  ${CMAKE_CURRENT_LIST_DIR}
  ${CMAKE_CURRENT_LIST_DIR}/mocks
  ${CMAKE_CURRENT_LIST_DIR}/..
  ${CMAKE_CURRENT_LIST_DIR}/../components
)
target_sources(bridge_ota_manager_test PRIVATE
  ../components/esp_tree_bridge/bridge_ota_manager.cpp
  mocks/test_time.cpp
)
add_test(NAME bridge_ota_manager_test COMMAND bridge_ota_manager_test)

add_executable(bridge_api_proto_messages_test bridge_api_proto_messages_test.cpp)
target_include_directories(bridge_api_proto_messages_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
target_sources(bridge_api_proto_messages_test PRIVATE
  ../components/esp_tree_bridge/bridge_api_proto_messages.cpp
)
add_test(NAME bridge_api_proto_messages_test COMMAND bridge_api_proto_messages_test)

# Session-table contract for the bridge: MAX_SESSIONS is enforced, and the
# low-RAM eviction walks a full table without running past its buffers.
add_executable(bridge_session_cap_test bridge_session_cap_test.cpp)
target_include_directories(bridge_session_cap_test PRIVATE
  ${CMAKE_CURRENT_LIST_DIR}
  ${CMAKE_CURRENT_LIST_DIR}/mocks
  ${CMAKE_CURRENT_LIST_DIR}/..
  ${CMAKE_CURRENT_LIST_DIR}/../components
)
target_sources(bridge_session_cap_test PRIVATE
  ../components/esp_tree_bridge/bridge_protocol.cpp
  ../components/esp_tree_common/espnow_crypto.cpp
  mocks/test_time.cpp
)
find_package(OpenSSL REQUIRED)
target_link_libraries(bridge_session_cap_test PRIVATE OpenSSL::Crypto)
add_test(NAME bridge_session_cap_test COMMAND bridge_session_cap_test)

# End-to-end join between a real leaf protocol and a real bridge protocol over
# in-memory queues: discovery, schema exchange, state sync, join completion and
# the replay gate. The only test that compiles both protocol files together.
add_executable(protocol_join_test protocol_join_test.cpp)
target_include_directories(protocol_join_test PRIVATE
  ${CMAKE_CURRENT_LIST_DIR}
  ${CMAKE_CURRENT_LIST_DIR}/mocks
  ${CMAKE_CURRENT_LIST_DIR}/..
  ${CMAKE_CURRENT_LIST_DIR}/../components
)
target_sources(protocol_join_test PRIVATE
  ../components/esp_tree_remote/remote_protocol.cpp
  ../components/esp_tree_remote/remote_file_receiver.cpp
  ../components/esp_tree_bridge/bridge_protocol.cpp
  ../components/esp_tree_common/espnow_crypto.cpp
  mocks/test_time.cpp
  mocks/mock_device.cpp
)
# The protocol selects its chip model at compile time and errors out for an
# unknown target, so name one.
target_compile_definitions(protocol_join_test PRIVATE CONFIG_IDF_TARGET_ESP32=1)
find_package(OpenSSL REQUIRED)
target_link_libraries(protocol_join_test PRIVATE OpenSSL::Crypto)
add_test(NAME protocol_join_test COMMAND protocol_join_test)

add_executable(cobs_codec_test cobs_codec_test.cpp)
target_include_directories(cobs_codec_test PRIVATE ${CMAKE_CURRENT_LIST_DIR}/.. ${CMAKE_CURRENT_LIST_DIR}/../components)
add_test(NAME cobs_codec_test COMMAND cobs_codec_test)
