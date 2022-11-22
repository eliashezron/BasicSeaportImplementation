// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;
import {BasicOrderParameters, BasicOrderType} from "./orderStruct.sol";

interface SeaportInterface {
    function fulfillBasicOrder(BasicOrderParameters calldata parameters)
        external
        payable
        returns (bool fulfilled);
}

contract Marketplace {
    address public seaport = 0x00000000006c3852cbEf3e08E8dF289169EdE581;
    uint256 internal offersLength = 0;
    mapping(uint256 => BasicOrderParameters) internal parameters;

    function createOffer(
        address _considerationToken, // 0x24
        uint256 _considerationAmount, // 0x64
        address _offerToken, // 0xc4
        uint256 _offerAmount, // 0x104
        bytes memory _signature
    ) public {
        parameters[offersLength] = BasicOrderParameters(
            _considerationToken,
            0,
            _considerationAmount,
            payable(msg.sender),
            address(0),
            _offerToken,
            0,
            _offerAmount,
            BasicOrderType.ERC721_TO_ERC20_FULL_OPEN,
            block.timestamp,
            block.timestamp + 5 days,
            bytes32(uint256(uint160(address(0)))),
            0,
            bytes32(uint256(uint160(address(0)))),
            bytes32(uint256(uint160(address(0)))),
            0,
            _signature
        );
        offersLength++;
    }

    function fullfillOffer(uint256 _offer) public {
        BasicOrderParameters memory params = parameters[_offer];
        SeaportInterface(seaport).fulfillBasicOrder(params);
        //clean up to remove the offer at that index
    }

    function getOfferLength() public view returns (uint256) {
        return offersLength;
    }
}
