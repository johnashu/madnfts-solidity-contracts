// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { IFactory } from "test/foundry/Base/Factory/IFactory.sol";

import { Strings } from "contracts/MADTokens/common/ImplBase.sol";

abstract contract CreateCollectionParams {
    // uint256 public defaultPrice = 1 ether;
    uint256 public defaultMaxSupply = 10_000;
    uint8 public defaultTokenType = 1; // ERC721Basic
    uint96 public defaultRoyalty = 1000; // 10% (max)
    string public defaultUri = "https://mad.network";

    // string private nextSalt;
    string private constant BASE_NAME = "createCollection";
    string private constant BASE_SYMBOL = "CC";

    uint256 public CreateCollectionSaltNonce = 12_345_678_912_346_589;

    function changeTokenType(uint8 _tokenType) public {
        defaultTokenType = _tokenType;
    }

    function updateCreateCollectionSalt() public returns (bytes32) {
        CreateCollectionSaltNonce++;
        return bytes32(abi.encodePacked(CreateCollectionSaltNonce));
    }

    function generateCollectionParams(
        uint8 _tokenType,
        uint256 _price,
        uint256 _maxSupply,
        string memory _uri,
        address _splitter,
        uint96 _royalty,
        address madFeeTokenAddress
    ) public returns (IFactory.CreateCollectionParams memory) {
        string memory name = BASE_NAME;
        string memory symbol = BASE_SYMBOL;

        return IFactory.CreateCollectionParams({
            madFeeTokenAddress: madFeeTokenAddress,
            tokenType: _tokenType,
            tokenSalt: updateCreateCollectionSalt(),
            collectionName: name,
            collectionSymbol: symbol,
            price: _price,
            maxSupply: _maxSupply,
            uri: _uri,
            splitter: _splitter,
            royalty: _royalty
        });
    }

    function defaultCollectionParams(
        address defaultSplitterAddress,
        uint256 defaultPrice,
        address madFeeTokenAddress
    ) public returns (IFactory.CreateCollectionParams memory) {
        return generateCollectionParams(
            defaultTokenType,
            defaultPrice,
            defaultMaxSupply,
            defaultUri,
            defaultSplitterAddress,
            defaultRoyalty,
            madFeeTokenAddress
        );
    }
}
