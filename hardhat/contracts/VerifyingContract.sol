// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract VerifyingContract is EIP712 {
    using ECDSA for bytes32;

    struct offerDetails {
        uint256 nonce;
        address offerer;
        address offerToken;
        uint256 offerAmount;
        address considerationToken;
        uint256 considerationAmount;
        uint256 startTime;
        uint256 endTime;
    }
    bytes32 private constant _TYPEHASH =
        keccak256(
            "offerDetails(uint256 nonce, address offerer,address offerToken,uint offerAmount,address considerationToken, uint256 considerationAmount,uint256 startTime,uint256 endTime)"
        );

    mapping(address => uint256) private _nonces;

    constructor() EIP712("VerifyingContract", "0.0.1") {}

    function getNonce(address offerer) public view returns (uint256) {
        return _nonces[offerer];
    }

    function verify(offerDetails calldata req, bytes calldata signature)
        public
        view
        returns (bool)
    {
        address signer = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _TYPEHASH,
                    req.nonce,
                    req.offerer,
                    req.offerToken,
                    req.offerAmount,
                    req.considerationToken,
                    req.considerationAmount,
                    req.startTime,
                    req.endTime
                )
            )
        ).recover(signature);
        return _nonces[req.offerer] == req.nonce && signer == req.offerer;
    }
}
