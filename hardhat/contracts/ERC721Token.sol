//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Used for minting test ERC721s in our tests
contract ERC721Token is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("TESTERC721", "TESTERC721") {}

    function mint(address to, uint256 count) public {
        for (uint256 i = 0; i < count; i++) {
            _mint(to, _tokenIds.current());
            _tokenIds.increment();
        }
    }
}
