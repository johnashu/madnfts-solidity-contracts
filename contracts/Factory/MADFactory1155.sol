// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { FactoryEventsAndErrors1155 } from
    "contracts/Shared/EventsAndErrors.sol";
import {
    MADFactoryBase,
    FactoryVerifier,
    Types,
    Bytes32AddressLib,
    SplitterImpl
} from "contracts/Factory/MADFactoryBase.sol";

// prettier-ignore
contract MADFactory1155 is MADFactoryBase, FactoryEventsAndErrors1155 {
    using Types for Types.Collection1155;
    using Bytes32AddressLib for address;
    using Bytes32AddressLib for bytes32;

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @dev `colIDs` are derived from adding 12 bytes of zeros to an
    /// collection's address.
    /// @dev colID => colInfo(salt/type/addr/time/splitter)
    mapping(bytes32 => Types.Collection1155) public colInfo;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(
        address _marketplace,
        address _signer,
        address _paymentTokenAddress
    ) MADFactoryBase(_marketplace, _signer, _paymentTokenAddress) { /*  */ }

    ////////////////////////////////////////////////////////////////
    //                           CORE FX                          //
    ////////////////////////////////////////////////////////////////

    /// @notice Core public ERC1155 token types deployment pusher.
    /// @dev Function Sighash := 0x73fd6808
    /// @dev Args passed as params in this function serve as common denominator
    /// for all token types.
    /// @dev Extra config options must be set directly by through token type
    /// specific functions in `MADRouter` contract.
    /// @dev Frontend must attent that salt values must have common pattern so
    /// to not replicate same output.
    /// @param _tokenType Values legend:
    /// 0=Minimal; 1=Basic; 2=Whitelist; 3=Lazy.
    /// @param _tokenSalt Nonce/Entropy factor used by CREATE3 method
    /// to generate collection deployment address. Must be always different to
    /// avoid address collision.
    /// @param _price Public mint price of the collection to be deployed.
    /// @param _maxSupply Maximum supply of tokens to be minted of the
    /// collection to be deployed
    /// (Not used for ERC1155Minimal token type, since it always equals to one).
    /// @param _uri The URL + CID to be added the tokenID and suffix (.json) by
    /// the tokenURI function
    /// in the collection to be deployed (baseURI used as tokenURI itself for
    /// the ERC1155Minimal token type).
    /// @param _splitter Previously deployed Splitter implementation so to
    /// validate and attach to collection.
    /// @param _royalty Ranges in between 0%-10%, in percentage basis points,
    /// accepted (Min tick := 25).
    function createCollection(
        uint8 _tokenType,
        string memory _tokenSalt,
        string memory _name,
        string memory _symbol,
        uint256 _price,
        uint256 _maxSupply,
        string memory _uri,
        address _splitter,
        uint96 _royalty,
        bytes32[] memory _extra
    ) external isThisOg {
        _limiter(_tokenType, _splitter);
        _royaltyLocker(_royalty);

        Types.ColArgs memory args = Types.ColArgs(
            "",
            "",
            _uri,
            _price,
            _maxSupply,
            _splitter,
            _royalty,
            router,
            address(erc20)
        );

        (bytes32 tokenSalt, address deployed) =
            _collectionDeploy(_tokenType, _tokenSalt, args, _extra);

        bytes32 colId = deployed.fillLast12Bytes();
        userTokens[tx.origin].push(colId);

        colInfo[colId] = Types.Collection1155(
            tx.origin, _tokenType, tokenSalt, block.number, _splitter
        );

        emit ERC1155BasicCreated(
            _splitter, deployed, _name, _symbol, _royalty, _maxSupply, _price
            );
    }

    ////////////////////////////////////////////////////////////////
    //                           HELPERS                          //
    ////////////////////////////////////////////////////////////////

    /// @inheritdoc FactoryVerifier
    function typeChecker(bytes32 _colID)
        external
        view
        override(FactoryVerifier)
        returns (uint8 pointer)
    {
        _isRouter();
        Types.Collection1155 storage col = colInfo[_colID];

        assembly {
            let x := sload(col.slot)
            pointer := shr(160, x)
        }
    }

    /// @inheritdoc FactoryVerifier
    function creatorCheck(bytes32 _colID)
        external
        view
        override(FactoryVerifier)
        returns (address creator, bool check)
    {
        _isRouter();
        Types.Collection1155 storage col = colInfo[_colID];

        assembly {
            let x := sload(col.slot)
            // bitmask to get the first 20 bytes of storage slot
            creator := and(x, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
            if eq(creator, origin()) { check := true }
            // if(!check) revert AccessDenied();
            if iszero(check) {
                mstore(0x00, 0x4ca88867)
                revert(0x1c, 0x04)
            }
        }
    }
}
