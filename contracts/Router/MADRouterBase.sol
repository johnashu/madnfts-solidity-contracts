// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { MAD } from "contracts/MAD.sol";
import { MADBase, ERC20 } from "contracts/Shared/MADBase.sol";
import { RouterEvents, FactoryVerifier } from "contracts/Shared/EventsAndErrors.sol";
import { SafeTransferLib } from "contracts/lib/utils/SafeTransferLib.sol";
import { FeeOracle } from "contracts/lib/tokens/common/FeeOracle.sol";

abstract contract MADRouterBase is MAD, MADBase, RouterEvents, FeeOracle {
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
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

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

    /// @notice FactoryVerifier connecting the router to madFactory.
    FactoryVerifier public madFactory;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    /// @notice Constructor requires a valid factory address and an optional erc20 payment token address.
    /// @param _paymentTokenAddress erc20 token address | address(0).
    /// @param _recipient 721 factory address.
    // B.1 - Remove maxFeeMint &  maxFeeBurn from constructor
    constructor(FactoryVerifier _factory, address _paymentTokenAddress, address _recipient) {
        // B.3 BlockHat Audit
        feeMint = 0.25 ether;

        if (_paymentTokenAddress != address(0)) {
            _setPaymentToken(_paymentTokenAddress);
        }
        setFactory(_factory);
        setRecipient(_recipient);
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

    /// @dev `MADFactory` instance setter.
    /// @dev Function Signature := 0x612990fe
    function setFactory(FactoryVerifier _factory) public onlyOwner {
        assembly {
            if iszero(_factory) {
                mstore(0x00, 0xd92e233d)
                revert(0x1c, 0x04)
            }
            sstore(madFactory.slot, _factory)
        }
        emit FactoryUpdated(_factory);
    }

    /// @dev Setter for public mint fee _recipient.
    /// @dev Function Sighash := ?
    function setRecipient(address _recipient) public onlyOwner {
        require(_recipient != address(0), "Invalid address");

        assembly {
            sstore(recipient.slot, _recipient)
        }

        emit RecipientUpdated(_recipient);
    }

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
}
