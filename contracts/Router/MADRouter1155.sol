// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { MADRouterBase, ERC20, FactoryVerifier } from "contracts/Router/MADRouterBase.sol";

import { ERC1155Basic } from "contracts/MADTokens/ERC1155/ERC1155Basic.sol";

contract MADRouter1155 is MADRouterBase {
    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    /// @notice Constructor requires a valid factory address and an optional erc20 payment token address.
    /// @param _factory 1155 factory address.
    /// @param _paymentTokenAddress erc20 token address | address(0).
    /// @param _recipient 721 factory address.
    // B.1 - Remove maxFeeMint &  maxFeeBurn from constructor
    constructor(
        FactoryVerifier _factory,
        address _paymentTokenAddress,
        address _recipient
    ) MADRouterBase(_factory, _paymentTokenAddress, _recipient) {}

    ////////////////////////////////////////////////////////////////
    //                       CREATOR SETTINGS                     //
    ////////////////////////////////////////////////////////////////

    /// @notice Collection baseURI setter.
    /// @dev Only available for Basic, Whitelist and Lazy token types. Events logged
    ///      by each tokens' BaseURISet functions.
    ///      Function Sighash := 0x4328bd00
    /// @param _token 1155 token address.
    /// @param _uri New URI string.
    function setBaseURI(address _token, string memory _uri) external nonReentrant whenNotPaused {
        (bytes32 _colID, uint8 _tokenType) = _tokenRender(_token);

        // if (_tokenType == 1) {
        _tokenType == 1 ? ERC1155Basic(_token).setBaseURI(_uri) : revert("INVALID_TYPE");

        emit BaseURISet(_colID, _uri);
    }

    /// @notice Collection baseURI locker preventing URI updates when set.
    ///      Cannot be unset!
    /// @dev Only available for Basic, Whitelist and Lazy token types. Events logged
    ///      by each tokens' setBaseURILock functions.
    ///      Function Sighash := ?
    /// @param _token 721 token address.
    function setURILock(address _token) public whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);

        _tokenType == 1 ? ERC1155Basic(_token).setBaseURILock() : revert("INVALID_TYPE");
    }

    /// @notice Global MintState setter/controller
    /// @dev Switch cases/control flow handling conditioned by both `_stateType` and `_tokenType`.
    ///      Events logged by each tokens' `setState` functions.
    ///      Function Sighash := 0xab9acd57
    /// @param _token 1155 token address.
    /// @param _state Set state to true or false.
    /*     /// @param _stateType Values:
    ///      0 := PublicMintState (minimal, basic, whitelist);
    ///      1 := WhitelistMintState (whitelist);
    ///      2 := FreeClaimState (whitelist). */
    function setMintState(
        address _token,
        bool _state
    )
        external
        // uint8 _stateType
        nonReentrant
        whenNotPaused
    {
        // require(_stateType < 3, "INVALID_TYPE");
        (bytes32 _colID, uint8 _tokenType) = _tokenRender(_token);

        _tokenType == 1 ? ERC1155Basic(_token).setPublicMintState(_state) : revert("INVALID_TYPE");

        emit PublicMintState(_colID, _tokenType, _state);
    }

    ////////////////////////////////////////////////////////////////
    //                       CREATOR MINTING                      //
    ////////////////////////////////////////////////////////////////

    /// @notice ERC1155Basic creator mint function handler.
    /// @dev Function Sighash := 0x490f7027
    /// @param _token 1155 token address.
    /// @param _to Receiver token address.
    /// @param _amount Num tokens to mint and send.
    /// @param _balances Receiver token balances array, length should be = _amount.
    function basicMintTo(
        address _token,
        address _to,
        uint256 _amount,
        uint256[] memory _balances
    ) external payable nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);
        if (_tokenType != 1) revert("INVALID_TYPE");
        _paymentCheck(0x40d097c3);
        ERC1155Basic(_token).mintTo{ value: msg.value }(_to, _amount, _balances, msg.sender);
    }

    /// @dev Function Sighash := 0x535f64e7
    /// @param _token 1155 token address.
    /// @param _to Token receiver address.
    /// @param _ids Receiver token _ids array.
    /// @param _balances Receiver token balances array, length should be = _ids.length.
    function basicMintBatchTo(
        address _token,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _balances
    ) external payable nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);
        if (_tokenType != 1) revert("INVALID_TYPE");
        _paymentCheck(0x40d097c3);
        ERC1155Basic(_token).mintBatchTo{ value: msg.value }(_to, _ids, _balances, msg.sender);
    }

    /// @notice Global token burn controller/single pusher for all token types.
    /// @dev Function Sighash := 0xba36b92d
    /// @param _token 1155 token address.
    /// @param _ids The token IDs of each token to be burnt;
    ///        should be left empty for the `ERC1155Minimal` type.
    /// @param to Array of addresses who own each token.
    /// @param _amount Array of receiver token balances array.
    function burn(
        address _token,
        uint256[] memory _ids,
        address[] memory to,
        uint256[] memory _amount
    ) external payable nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);
        _paymentCheck(0x44df8e70);
        _tokenType == 1
            ? ERC1155Basic(_token).burn{ value: msg.value }(to, _ids, _amount, msg.sender)
            : revert("INVALID_TYPE");
    }

    /// @notice Global token batch burn controller/single pusher for all token types.
    /// @dev Function Sighash := 0xba36b92d
    /// @param _token 1155 token address.
    /// @param _from Array of addresses who own each token.
    /// @param _ids The token IDs of each token to be burnt;
    ///        should be left empty for the `ERC1155Minimal` type.
    /// @param _balances Array of corresponding token balances to burn.
    function batchBurn(
        address _token,
        address _from,
        uint256[] memory _ids,
        uint256[] memory _balances
    ) external payable nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);

        _paymentCheck(0x44df8e70);
        _tokenType == 1
            ? ERC1155Basic(_token).burnBatch{ value: msg.value }(_from, _ids, _balances, msg.sender)
            : revert("INVALID_TYPE");
    }

    ////////////////////////////////////////////////////////////////
    //                       CREATOR WITHDRAW                     //
    ////////////////////////////////////////////////////////////////

    /// @notice Withdraw both ERC20 and ONE from ERC1155 contract's balance.
    /// @dev Leave `_token` param empty for withdrawing eth only. No withdraw min needs to be passed as params, since
    ///      all balance from the token's contract is emptied.
    ///      Function Sighash := 0xf940e385
    /// @param _token 1155 token address.
    /// @param _erc20 ERC20 token address.
    // B.2 BlockHat Audit  -remove whenPaused
    function withdraw(address _token, ERC20 _erc20) external nonReentrant {
        (bytes32 _colID, uint8 _tokenType) = _tokenRender(_token);

        if (_tokenType == 1) {
            address(_erc20) != address(0) && _erc20.balanceOf(_token) != 0
                ? ERC1155Basic(_token).withdrawERC20(_erc20, recipient)
                : _token.balance != 0
                ? ERC1155Basic(_token).withdraw(recipient)
                : revert("NO_FUNDS");

            emit TokenFundsWithdrawn(_colID, _tokenType, msg.sender);
        } else revert("INVALID_TYPE");
    }

    ////////////////////////////////////////////////////////////////
    //                         HELPERS                            //
    ////////////////////////////////////////////////////////////////

    /// @notice Private auth-check mechanism that verifies `MADFactory` storage.
    /// @dev Retrieves both `colID` (bytes32) and collection type (uint8)
    ///      for valid token and approved user.
    ///      Function Sighash := 0xdbf62b2e
    /// @param _token 1155 token address.
    function _tokenRender(address _token) private view returns (bytes32 colID, uint8 tokenType) {
        colID = madFactory.getColID(_token);
        madFactory.creatorCheck(colID);
        tokenType = madFactory.typeChecker(colID);
    }
}
