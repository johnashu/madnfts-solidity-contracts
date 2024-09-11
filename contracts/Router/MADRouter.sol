// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import {
    MADRouterBase,
    IERC20,
    FactoryVerifier
} from "contracts/Router/MADRouterBase.sol";

import { ERC1155Basic } from "contracts/MADTokens/ERC1155/ERC1155Basic.sol";

import { ERC721Basic } from "contracts/MADTokens/ERC721/ERC721Basic.sol";

contract MADRouter is MADRouterBase {
    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    /// @notice Constructor requires a valid factory address and an optional
    /// erc20 payment token address.
    /// @param _factory  factory address.
    /// @param _recipient fee payment address.
    constructor(FactoryVerifier _factory, address _recipient)
        MADRouterBase(_factory, _recipient)
    { }

    ////////////////////////////////////////////////////////////////
    //                    CREATOR MINTING ERC721                  //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint to, a public state-modifying function.
     * @notice Accepts ether.
     * @notice ERC721Basic creator mint function handler.
     * @param collection 721 token address.
     * @param _to Receiver token address.
     * @param _amount Num tokens to mint and send. (uint128).
     * @custom:signature mintTo(address,address,uint128)
     * @custom:selector 0x49fa55ad
     */
    function mintTo(address collection, address _to, uint128 _amount)
        public
        payable
    {
        _isCollectionOwner(collection);
        _tokenRender(collection);
        uint256 _fee = _handleFees(_FEE_MINT, 1);
        uint256 _value = msg.value - _fee;
        ERC721Basic(collection).mintTo{ value: _value }(_to, _amount);
    }

    /**
     * @notice Mint to, a public state-modifying function.
     * @notice Accepts ether.
     * @notice ERC721Basic creator mint function handler.
     * @param collection 721 token address.
     * @param _to Receiver token address.
     * @param _amount Num tokens to mint and send. (uint128)
     * @param madFeeTokenAddress ERC20 token address.
     * @custom:signature mintTo(address,address,uint128,address)
     * @custom:selector 0x395e37ec
     */
    function mintTo(
        address collection,
        address _to,
        uint128 _amount,
        address madFeeTokenAddress
    ) public payable {
        _isCollectionOwner(collection);
        _tokenRender(collection);
        _handleFees(1, madFeeTokenAddress, this.feeMintErc20);
        ERC721Basic(collection).mintTo(_to, _amount);
    }

    ////////////////////////////////////////////////////////////////
    //                    PUBLIC MINTING ERC721                  //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint, a public state-modifying function.
     * @notice Accepts ether.
     * @notice public mint function if madRouter is authorised.
     * This will open up public minting to this contract if the owner has
     * enabled the authorisation for the router.
     * @dev Transfer event emitted by parent ERC721 contract.
     * @dev collection 721 token address.
     * @param _amount The amount of tokens to mint.
     * @custom:signature mint(address,uint128)
     * @custom:selector 0xbe29184f
     */
    function mint(address collection, uint128 _amount) public payable {
        _tokenRender(collection);
        uint256 _fee = _handleFees(_FEE_MINT, 1);
        uint256 _value = msg.value - _fee;
        ERC721Basic(collection).mint{ value: _value }(msg.sender, _amount);
    }

    /**
     * @notice Mint, a public state-modifying function.
     * @notice Accepts ether.
     * @notice public mint function if madRouter is authorised.
     * This will open up public minting to this contract if the owner has
     * enabled the authorisation for the router.
     * @dev Transfer event emitted by parent ERC721 contract.
     * @dev collection 721 token address.
     * @param _amount The amount of tokens to mint.
     * @param madFeeTokenAddress ERC20 token address.
     * @custom:signature mint(address,uint128,address)
     * @custom:selector 0x9a255db6
     */
    function mint(
        address collection,
        uint128 _amount,
        address madFeeTokenAddress
    ) public payable {
        _tokenRender(collection);
        _handleFees(1, madFeeTokenAddress, this.feeMintErc20);
        ERC721Basic(collection).mint(msg.sender, _amount);
    }

    ////////////////////////////////////////////////////////////////
    //                   BURNING ERC721                           //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Burn, a public state-modifying function.
     * @notice Accepts ether.
     * @notice Global token burn controller/single pusher for ERC721 token
     * types.
     * @param collection 721 token address.
     * @param _ids The token IDs of each token to be burnt;uint128s.
     * @custom:signature burn(address,uint128[])
     * @custom:selector 0xf12bd09e
     */
    function burn(address collection, uint128[] memory _ids) public payable {
        _tokenRender(collection);
        uint256 _fee = _handleFees(_FEE_BURN, 1);
        uint256 _value = msg.value - _fee;
        ERC721Basic(collection).burn{ value: _value }(_ids);
    }

    /**
     * @notice Burn, a public state-modifying function.
     * @notice Global token burn controller/single pusher for ERC721 token
     * types.
     * @notice Accepts ether.
     * @param collection 721 token address.
     * @param _ids The token IDs of each token to be burnt;
     * @param madFeeTokenAddress ERC20 token address for Mad Fees.
     * @custom:signature burn(address,uint128[],address)
     * @custom:selector 0xbb05d8ef
     */
    function burn(
        address collection,
        uint128[] memory _ids,
        address madFeeTokenAddress
    ) public payable {
        _tokenRender(collection);
        _handleFees(1, madFeeTokenAddress, this.feeBurnErc20);
        ERC721Basic(collection).burn(_ids);
    }

    ////////////////////////////////////////////////////////////////
    //                   CREATOR MINTING  ERC1155                 //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint to, a public state-modifying function.
     * @notice Accepts ether.
     * @notice ERC1155Basic creator mint function handler.
     * @param collection 1155 token address.
     * @param _to Receiver token address.
     * @param _id Token ID.
     * @param _amount Num tokens to mint and send.
     * @param _maxSupply Max supply of the id.
     * @custom:signature mintTo(address,address,uint256,uint256)
     * @custom:selector 0x292af4be
     */
    function mintTo(
        address collection,
        address _to,
        uint256 _id,
        uint256 _amount,
        uint256 _maxSupply
    ) public payable {
        _isCollectionOwner(collection);
        _tokenRender(collection);
        // Charge per ID so the amount here is 1
        uint256 _fee = _handleFees(_FEE_MINT, 1);
        uint256 _value = msg.value - _fee;
        ERC1155Basic erc1155Contract = ERC1155Basic(collection);
        // set max supply of the id, can be left as 0 if already set.
        erc1155Contract.setMaxSupply(_id, _maxSupply);
        erc1155Contract.mintTo{ value: _value }(_to, _id, _amount);
    }

    /**
     * @notice Mint to, a public state-modifying function.
     * @notice Accepts ether.
     * @notice ERC1155Basic creator mint function handler.
     * @param collection 1155 token address.
     * @param _to Receiver token address.
     * @param _id Token ID.
     * @param _amount Num tokens to mint and send.
     * @param madFeeTokenAddress ERC20 token address.
     * @param _maxSupply Max supply of the id.
     * @custom:signature mintTo(address,address,uint256,uint256,address)
     * @custom:selector 0x0a7309b2
     */
    function mintTo(
        address collection,
        address _to,
        uint256 _id,
        uint256 _amount,
        address madFeeTokenAddress,
        uint256 _maxSupply
    ) public payable {
        _isCollectionOwner(collection);
        _tokenRender(collection);
        // Charge per ID so the amount here is 1
        _handleFees(1, madFeeTokenAddress, this.feeMintErc20);
        ERC1155Basic erc1155Contract = ERC1155Basic(collection);
        // set max supply of the id, can be left as 0 if already set.
        erc1155Contract.setMaxSupply(_id, _maxSupply);
        erc1155Contract.mintTo(_to, _id, _amount);
    }

    ////////////////////////////////////////////////////////////////
    //                    CREATOR BATCH MINTING ERC1155            //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint batch to, a public state-modifying function.
     * @notice Accepts ether.
     * @notice ERC1155Basic creator mint function handler.
     * @param collection 1155 token address.
     * @param _to Token receiver address.
     * @param _ids Receiver token _ids array.
     * @param _amounts Receiver token balances array, length should be ==
     * _ids.length.
     * @param _maxSupplies Max supply of each token in the batch.
     * length should be == _ids.length.
     * @custom:signature
     * mintBatchTo(address,address,uint256[],uint256[],uint256[])
     * @custom:selector 0x5ec5a434
     */
    function mintBatchTo(
        address collection,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        uint256[] memory _maxSupplies
    ) public payable {
        _isCollectionOwner(collection);
        _tokenRender(collection);
        uint256 _fee = _handleFees(_FEE_MINT, _ids.length);
        uint256 _value = msg.value - _fee;
        ERC1155Basic erc1155Contract = ERC1155Basic(collection);
        erc1155Contract.batchSetMaxSupply(_ids, _maxSupplies);
        erc1155Contract.mintBatchTo{ value: _value }(_to, _ids, _amounts);
    }

    /**
     * @notice Mint batch to, a public state-modifying function.
     * @notice Accepts ether.
     * @notice ERC115Basic creator mint function handler.
     * @param collection 1155 token address.
     * @param _to Token receiver address.
     * @param _ids Receiver token _ids array.
     * @param _amounts Receiver token balances array, length should be ==
     * _ids.length.
     * @param madFeeTokenAddress ERC20 token address.
     * @param _maxSupplies Max supply of each token in the batch.
     * length should be == _ids.length.
     * @custom:signature
     * mintBatchTo(address,address,uint256[],uint256[],address)
     * @custom:selector 0x6308ec41
     */
    function mintBatchTo(
        address collection,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        address madFeeTokenAddress,
        uint256[] memory _maxSupplies
    ) public payable {
        _isCollectionOwner(collection);
        _tokenRender(collection);
        _handleFees(_ids.length, madFeeTokenAddress, this.feeMintErc20);
        ERC1155Basic erc1155Contract = ERC1155Basic(collection);
        erc1155Contract.batchSetMaxSupply(_ids, _maxSupplies);
        erc1155Contract.mintBatchTo(_to, _ids, _amounts);
    }

    ////////////////////////////////////////////////////////////////
    //                    PUBLIC MINTING ERC1155                  //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint, a public state-modifying function.
     * @notice Accepts ether.
     * @notice public mint function if madRouter is authorised.
     * This will open up public minting to this contract if the owner has
     * enabled the authorisation for the router.
     * @param collection 1155 token address.
     * @param _amount Num tokens to mint and send.
     * @custom:signature mint(address,uint256,uint256)
     * @custom:selector 0x156e29f6
     */
    function mint(address collection, uint256 _id, uint256 _amount)
        public
        payable
    {
        _tokenRender(collection);
        // Charge per ID so the amount here is 1
        uint256 _fee = _handleFees(_FEE_MINT, 1);
        uint256 _value = msg.value - _fee;
        ERC1155Basic(collection).mint{ value: _value }(msg.sender, _id, _amount);
    }

    /**
     * @notice Mint, a public state-modifying function.
     * @notice Accepts ether.
     * @notice public mint function if madRouter is authorised.
     * This will open up public minting to this contract if the owner has
     * enabled the authorisation for the router.
     * @param collection 1155 token address.
     * @param _amount Num tokens to mint and send.
     * @param madFeeTokenAddress ERC20 token address.
     * @custom:signature mint(address,uint256,uint256,address)
     * @custom:selector 0xf74bfe8e
     */
    function mint(
        address collection,
        uint256 _id,
        uint256 _amount,
        address madFeeTokenAddress
    ) public payable {
        _tokenRender(collection);
        // Charge per ID so the amount here is 1
        _handleFees(1, madFeeTokenAddress, this.feeMintErc20);
        ERC1155Basic(collection).mint(msg.sender, _id, _amount);
    }

    ////////////////////////////////////////////////////////////////
    //                    PUBLIC BATCH MINTING ERC1155            //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint, a public state-modifying function.
     * @notice Accepts ether.
     * @notice public mint function if madRouter is authorised.
     * This will open up public minting to this contract if the owner has
     * enabled the authorisation for the router.
     * @param collection 1155 token address.
     * @param _ids Token IDs array.
     * @param _amounts Token amounts array.
     * @custom:signature mintBatch(address,uint256[],uint256[])
     * @custom:selector 0xd81d0a15
     */
    function mintBatch(
        address collection,
        uint256[] memory _ids,
        uint256[] calldata _amounts
    ) public payable {
        _tokenRender(collection);
        uint256 _fee = _handleFees(_FEE_MINT, _ids.length);
        uint256 _value = msg.value - _fee;
        ERC1155Basic(collection).mintBatch{ value: _value }(
            msg.sender, _ids, _amounts
        );
    }

    /**
     * @notice Mint, a public state-modifying function.
     * @notice Accepts ether.
     * @notice public mint function if madRouter is authorised.
     * This will open up public minting to this contract if the owner has
     * enabled the authorisation for the router.
     * @param collection 1155 token address.
     * @param _ids Token IDs array.
     * @param _amounts Token amounts array.
     * @param madFeeTokenAddress ERC20 token address.
     * @custom:signature mintBatch(address,uint256[],uint256[],address)
     * @custom:selector 0x149b2228
     */
    function mintBatch(
        address collection,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        address madFeeTokenAddress
    ) public payable {
        _tokenRender(collection);
        _handleFees(_ids.length, madFeeTokenAddress, this.feeMintErc20);
        ERC1155Basic(collection).mintBatch(msg.sender, _ids, _amounts);
    }

    ////////////////////////////////////////////////////////////////
    //                    PUBLIC BURNING ERC1155                  //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Burn, a public state-modifying function.
     * @notice Accepts ether.
     * @notice Global token burn controller/single pusher for 1155 token
     * types.
     * @param collection 1155 token address.
     * @param _id The token ID of each token to be burnt;
     * @param from address of who owns the token.
     * @param _amount receiver token balance .
     * @custom:signature burn(address,uint256,address,uint256)
     * @custom:selector 0xd7020d0a
     */
    function burn(
        address collection,
        address from,
        uint256 _id,
        uint256 _amount
    ) public payable {
        _tokenRender(collection);
        // Charge per ID so the amount here is 1
        uint256 _fee = _handleFees(_FEE_BURN, 1);
        uint256 _value = msg.value - _fee;
        ERC1155Basic(collection).burn{ value: _value }(from, _id, _amount);
    }

    /**
     * @notice Burn, a public state-modifying function.
     * @notice Accepts ether.
     * @notice Global token burn controller/single pusher for 1155 token types.
     * @param collection 1155 token address.
     * @param _id The token ID of each token to be burnt;
     * @param from address of who owns the token.
     * @param _amount receiver token balance .
     * @param madFeeTokenAddress ERC20 token address.
     * @custom:signature burn(address,uint256,address,uint256)
     * @custom:selector 0xbaa26e61
     */
    function burn(
        address collection,
        address from,
        uint256 _id,
        uint256 _amount,
        address madFeeTokenAddress
    ) public payable {
        _tokenRender(collection);
        // Charge per ID so the amount here is 1
        _handleFees(1, madFeeTokenAddress, this.feeBurnErc20);
        ERC1155Basic(collection).burn(from, _id, _amount);
    }

    ////////////////////////////////////////////////////////////////
    //                    PUBLIC BATCH BURNING ERC1155            //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Batch burn, a public state-modifying function.
     * @notice Accepts ether.
     * @notice Global token batch burn controller/single pusher for 1155 token
     * types.
     * @param collection 1155 token address.
     * @param _from Array of addresses who own each token.
     * @param _ids The token IDs of each token to be burnt;
     *       should be left empty for the `ERC1155Minimal` type.
     * @param _amounts Array of corresponding token balances to burn.
     * @custom:signature batchBurn(address,address,uint256[],uint256[])
     * @custom:selector 0x8b9f1815
     */
    function batchBurn(
        address collection,
        address _from,
        uint256[] memory _ids,
        uint256[] memory _amounts
    ) public payable {
        _tokenRender(collection);
        uint256 _fee = _handleFees(_FEE_BURN, _ids.length);
        uint256 _value = msg.value - _fee;
        ERC1155Basic(collection).burnBatch{ value: _value }(
            _from, _ids, _amounts
        );
    }

    /**
     * @notice Batch burn, a public state-modifying function.
     * @notice Accepts ether.
     * @notice Global token batch burn controller/single pusher for 1155 token
     * types.
     * @param collection 1155 token address.
     * @param _from Array of addresses who own each token.
     * @param _ids The token IDs of each token to be burnt;
     *        should be left empty for the `ERC1155Minimal` type.
     * @param _amounts Array of corresponding token balances to burn.
     * @param madFeeTokenAddress ERC20 token address.
     * @custom:signature batchBurn(address,address,uint256[],uint256[],address)
     * @custom:selector 0x940f5598
     */
    function batchBurn(
        address collection,
        address _from,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        address madFeeTokenAddress
    ) public payable {
        _tokenRender(collection);
        _handleFees(_ids.length, madFeeTokenAddress, this.feeBurnErc20);
        ERC1155Basic(collection).burnBatch(_from, _ids, _amounts);
    }
}
