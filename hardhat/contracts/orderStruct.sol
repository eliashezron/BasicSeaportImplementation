// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
enum BasicOrderType {
    //  16: no partial fills, anyone can execute
    ERC721_TO_ERC20_FULL_OPEN,
    //  8: no partial fills, anyone can execute
    ERC20_TO_ERC721_FULL_OPEN
}
struct BasicOrderParameters {
    // calldata offset
    address considerationToken; // 0x24
    uint256 considerationIdentifier; // 0x44
    uint256 considerationAmount; // 0x64
    address payable offerer; // 0x84
    address zone; // 0xa4
    address offerToken; // 0xc4
    uint256 offerIdentifier; // 0xe4
    uint256 offerAmount; // 0x104
    BasicOrderType basicOrderType; // 0x124
    uint256 startTime; // 0x144
    uint256 endTime; // 0x164
    bytes32 zoneHash; // 0x184
    uint256 salt; // 0x1a4
    bytes32 offererConduitKey; // 0x1c4
    bytes32 fulfillerConduitKey; // 0x1e4
    uint256 totalOriginalAdditionalRecipients; // 0x204
    bytes signature; // 0x244
    // Total length, excluding dynamic array data: 0x264 (580)
}
