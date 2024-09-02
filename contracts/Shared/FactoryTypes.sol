// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

// prettier-ignore
library FactoryTypes {
    struct CreateCollectionParams {
        address madFeeTokenAddress;
        uint8 tokenType;
        bytes32 tokenSalt;
        string collectionName;
        string collectionSymbol;
        uint256 price;
        uint256 maxSupply;
        string uri;
        address splitter;
        uint96 royalty;
    }

    struct CreateSplitterParams {
        bytes32 splitterSalt;
        address ambassador;
        address project;
        uint256 ambassadorShare;
        uint256 projectShare;
        address madFeeTokenAddress;
    }

    struct CollectionArgs {
        string _name;
        string _symbol;
        string _baseURI;
        uint256 _price;
        uint256 _maxSupply;
        address _splitter;
        uint96 _royaltyPercentage;
        address _router;
        address _erc20;
        address _owner;
    }

    struct Collection {
        address creator;
        uint8 collectionType;
        bytes32 collectionSalt;
        uint256 blocknumber;
        address splitter;
        bool isValid;
    }

    struct SplitterConfig {
        address splitter;
        bytes32 splitterSalt;
        address ambassador;
        address project;
        uint256 ambassadorShare;
        uint256 projectShare;
        bool valid;
    }
}
