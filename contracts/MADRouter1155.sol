// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { MAD } from "contracts/MAD.sol";
import { RouterEvents, FactoryVerifier } from "contracts/EventsAndErrors.sol";

import { ERC20 } from "contracts/lib/tokens/ERC20.sol";
import { ERC1155Basic } from "contracts/lib/tokens/ERC1155/Impl/ERC1155Basic.sol";

import { SafeTransferLib } from "contracts/lib/utils/SafeTransferLib.sol";
import { ReentrancyGuard } from "contracts/lib/security/ReentrancyGuard.sol";
import { Pausable } from "contracts/lib/security/Pausable.sol";
import { Owned } from "contracts/lib/auth/Owned.sol";
import { FeeOracle } from "contracts/lib/tokens/common/FeeOracle.sol";

contract MADRouter1155 is MAD, RouterEvents, Owned(msg.sender), Pausable, ReentrancyGuard, FeeOracle {
    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice FactoryVerifier connecting the router to MADFactory1155.
    FactoryVerifier public MADFactory1155;

    /// @notice ERC20 payment token address.
    ERC20 public erc20;

    /// @notice Passed to feeLookup to return feeMint.
    bytes4 internal constant MINSAFEMINT = 0x40d097c3;

    /// @notice Passed to feeLookup to return feeBurn.
    bytes4 internal constant MINBURN = 0x44df8e70;

    /// @notice Mint fee store.
    uint256 public feeMint = 0;

    /// @notice Burn fee store.
    uint256 public feeBurn = 0;

    /// @dev The recipient address used for public mint fees.
    address public recipient;

    /// @notice max fee that can be set for mint - B.1 remove from constructor
    uint256 public maxFeeMint = 2.5 ether;

    /// @notice max fee that can be set for burn - B.1 remove from constructor
    uint256 public maxFeeBurn = 0.5 ether;

    /// @notice Contract name.
    /// @dev Function Sighash := 0x06fdde03
    function name() external pure override(MAD) returns (string memory) {
        assembly {
            mstore(0x20, 0x20)
            mstore(0x46, 0x6726F75746572)
            return(0x20, 0x60)
        }
    }

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    /// @notice Constructor requires a valid factory address and an optional erc20 payment token address.
    /// @param _factory 1155 factory address.
    /// @param _paymentTokenAddress erc20 token address | address(0).
    /// @param _recipient 721 factory address.
    // B.1 - Remove maxFeeMint &  maxFeeBurn from constructor
    constructor(FactoryVerifier _factory, address _paymentTokenAddress, address _recipient) {
        // B.3 BlockHat Audit
        feeMint = 0.25 ether;

        MADFactory1155 = _factory;
        if (_paymentTokenAddress != address(0)) {
            _setPaymentToken(_paymentTokenAddress);
        }
        setRecipient(_recipient);
    }

    ////////////////////////////////////////////////////////////////
    //                       CREATOR SETTINGS                     //
    ////////////////////////////////////////////////////////////////

    /// @dev Setter for public mint fee _recipient.
    /// @dev Function Sighash := ?
    function setRecipient(address _recipient) public onlyOwner {
        require(_recipient != address(0), "Invalid address");

        assembly {
            sstore(recipient.slot, _recipient)
        }

        emit RecipientUpdated(_recipient);
    }

    /// @notice Enables the contract's owner to change payment token address.
    /// @dev Function Signature := 0x6a326ab1
    /// @param _paymentTokenAddress erc20 token address | address(0).
    function _setPaymentToken(address _paymentTokenAddress) private {
        erc20 = ERC20(_paymentTokenAddress);
        emit PaymentTokenUpdated(_paymentTokenAddress);
    }

    /// @notice Collection baseURI setter.
    /// @dev Only available for Basic, Whitelist and Lazy token types. Events logged
    ///      by each tokens' BaseURISet functions.
    ///      Function Sighash := 0x4328bd00
    /// @param _token 1155 token address.
    /// @param _uri New URI string.
    function setURI(address _token, string memory _uri) external nonReentrant whenNotPaused {
        (bytes32 _colID, uint8 _tokenType) = _tokenRender(_token);

        // if (_tokenType == 1) {
        _tokenType == 1 ? ERC1155Basic(_token).setURI(_uri) : revert("INVALID_TYPE");

        emit BaseURI(_colID, _uri);
    }

    /// @notice Collection baseURI locker preventing URI updates when set.
    ///      Cannot be unset!
    /// @dev Only available for Basic, Whitelist and Lazy token types. Events logged
    ///      by each tokens' setBaseURILock functions.
    ///      Function Sighash := ?
    /// @param _token 721 token address.
    function setURILock(address _token) external nonReentrant whenNotPaused {
        (, uint8 _tokenType) = _tokenRender(_token);

        _tokenType == 1 ? ERC1155Basic(_token).setURILock() : revert("INVALID_TYPE");
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

    /// @notice Mint and burn fee lookup.
    /// @dev Function Sighash := 0xedc9e7a4
    /// @param sigHash MINSAFEMINT | MINBURN
    function feeLookup(bytes4 sigHash) external view override(FeeOracle) returns (uint256 fee) {
        assembly {
            for {

            } 1 {

            } {
                if eq(MINSAFEMINT, sigHash) {
                    fee := sload(feeMint.slot)
                    break
                }
                if eq(MINBURN, sigHash) {
                    fee := sload(feeBurn.slot)
                    break
                }
                fee := 0x00
                break
            }
        }
    }

    /// @notice Private auth-check mechanism that verifies `MADFactory` storage.
    /// @dev Retrieves both `colID` (bytes32) and collection type (uint8)
    ///      for valid token and approved user.
    ///      Function Sighash := 0xdbf62b2e
    /// @param _token 1155 token address.
    function _tokenRender(address _token) private view returns (bytes32 colID, uint8 tokenType) {
        colID = MADFactory1155.getColID(_token);
        MADFactory1155.creatorCheck(colID);
        tokenType = MADFactory1155.typeChecker(colID);
    }

    // /// @notice Checks if native || erc20 payments are matche required fees
    /// @dev Envokes safeTransferFrom for erc20 payments.
    ///      Function Sighash := ?
    /// @param sigHash MINSAFEMINT | MINBURN
    function _paymentCheck(bytes4 sigHash) internal {
        if (address(erc20) != address(0)) {
            uint256 value = erc20.allowance(msg.sender, address(this));
            uint256 _fee = FeeOracle(this).feeLookup(sigHash);
            assembly {
                if iszero(eq(value, _fee)) {
                    mstore(0x00, 0xf7760f25)
                    revert(0x1c, 0x04)
                }
            }
            SafeTransferLib.safeTransferFrom(erc20, msg.sender, address(this), value);
        }
    }

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////

    /// @notice Change the Routers mint and burn fees.
    /// @dev Event emitted by token contract.
    ///      Function Sighash := 0x0b78f9c0
    /// @param _feeMint New mint fee.
    /// @param _feeBurn New burn fee.
    function setFees(uint256 _feeMint, uint256 _feeBurn) external onlyOwner {
        require(_feeMint <= maxFeeMint && _feeBurn <= maxFeeBurn, "Invalid fee settings, beyond max");
        assembly {
            sstore(feeBurn.slot, _feeBurn)
            sstore(feeMint.slot, _feeMint)
        }

        emit FeesUpdated(_feeMint, _feeBurn);
    }

    /// @notice Paused state initializer for security risk mitigation pratice.
    /// @dev Function Sighash := 0x8456cb59
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpaused state initializer for security risk mitigation pratice.
    /// @dev Function Sighash := 0x3f4ba83a
    function unpause() external onlyOwner {
        _unpause();
    }
}
