// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { MADRouterBase, ERC20, FactoryVerifier } from "contracts/Router/MADRouterBase.sol";

import { ERC721Basic } from "contracts/lib/tokens/ERC721/Impl/ERC721Basic.sol";

contract MADRouter721 is MADRouterBase {
    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    /// @notice Constructor requires a valid factory address and an optional erc20 payment token address.
    /// @param _factory 721 factory address.
    /// @param _paymentTokenAddress erc20 token address | address(0).
    /// @param _recipient 721 factory address.
    // A.1 - Remove maxFeeMint &  maxFeeBurn from constructor
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
    /// @param _token 721 token address.
    /// @param _baseURI New base URI string.
    function setBase(address _token, string memory _baseURI) external nonReentrant whenNotPaused {
        (bytes32 _colID, uint8 _tokenType) = _tokenRender(_token);

        _tokenType == 1 ? ERC721Basic(_token).setBaseURI(_baseURI) : revert("INVALID_TYPE");

        emit BaseURI(_colID, _baseURI);
    }

    /// @notice Collection baseURI locker preventing URI updates when set.
    ///      Cannot be unset!
    /// @dev Only available for Basic, Whitelist and Lazy token types. Events logged
    ///      by each tokens' setBaseURILock functions.
    ///      Function Sighash := ?
    /// @param _token 721 token address.
    function setBaseLock(address _token) external nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);

        _tokenType == 1 ? ERC721Basic(_token).setBaseURILock() : revert("INVALID_TYPE");
    }

    /// @notice Global MintState setter/controller
    /// @dev Switch cases/control flow handling conditioned by both `_stateType` and `_tokenType`.
    ///      Events logged by each tokens' `setState` functions.
    ///      Function Sighash := 0xab9acd57
    /// @param _token 721 token address.
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

        _tokenType == 1 ? ERC721Basic(_token).setPublicMintState(_state) : revert("INVALID_TYPE");

        emit PublicMintState(_colID, _tokenType, _state);
    }

    ////////////////////////////////////////////////////////////////
    //                       CREATOR MINTING                      //
    ////////////////////////////////////////////////////////////////

    /// @notice ERC721Basic creator mint function handler.
    /// @dev Function Sighash := 0x490f7027
    /// @param _token 721 token address.
    /// @param _to Receiver token address.
    /// @param _amount Num tokens to mint and send.
    function basicMintTo(address _token, address _to, uint256 _amount) external payable nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);
        if (_tokenType != 1) revert("INVALID_TYPE");
        _paymentCheck(0x40d097c3);
        ERC721Basic(_token).mintTo{ value: msg.value }(_to, _amount, msg.sender);
    }

    /// @notice Global token burn controller/single pusher for all token types.
    /// @dev Function Sighash := 0xba36b92d
    /// @param _token 721 token address.
    /// @param _ids The token IDs of each token to be burnt;
    ///        should be left empty for the `ERC721Minimal` type.
    function burn(address _token, uint256[] memory _ids) external payable nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);
        _paymentCheck(0x44df8e70);

        _tokenType == 1 ? ERC721Basic(_token).burn{ value: msg.value }(_ids, msg.sender) : revert("INVALID_TYPE");
    }

    ////////////////////////////////////////////////////////////////
    //                       CREATOR WITHDRAW                     //
    ////////////////////////////////////////////////////////////////

    /// @notice Withdraw both ERC20 and ONE from ERC721 contract's balance.
    /// @dev Leave `_token` param empty for withdrawing eth only. No withdraw min needs to be passed as params, since
    ///      all balance from the token's contract is emptied.
    ///      Function Sighash := 0xf940e385
    /// @param _token 721 token address.
    /// @param _erc20 ERC20 token address.
    // A.2 BlockHat Audit  -remove whenPaused
    function withdraw(address _token, ERC20 _erc20) external nonReentrant {
        (bytes32 _colID, uint8 _tokenType) = _tokenRender(_token);

        if (_tokenType == 1) {
            address(_erc20) != address(0) && _erc20.balanceOf(_token) != 0
                ? ERC721Basic(_token).withdrawERC20(_erc20, recipient)
                : _token.balance != 0
                ? ERC721Basic(_token).withdraw(recipient)
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
    /// @param _token 721 token address.
    function _tokenRender(address _token) private view returns (bytes32 colID, uint8 tokenType) {
        colID = madFactory.getColID(_token);
        madFactory.creatorCheck(colID);
        tokenType = madFactory.typeChecker(colID);
    }
}
