// SPDX-License-Identifier: AGPL-3.0-only

/// @title Payment splitter base contract that allows to split Ether payments
/// among a group of
/// accounts.
/// @author Modified from OpenZeppelin Contracts
/// (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol)

pragma solidity 0.8.22;

import { SplitterEventsAndErrors } from
    "contracts/Splitter/SplitterEventsAndErrors.sol";
import {
    SafeTransferLib, IERC20
} from "contracts/lib/utils/SafeTransferLib.sol";

// prettier-ignore
//
/// @notice The split can be in equal parts or in any other arbitrary
/// proportion.
/// The way this is specified is by assigning each account to a number of
/// shares.
/// Of all the Ether that this contract receives, each account will then be able
/// to claim
/// an amount proportional to the percentage of total shares they were assigned.

/// @dev `PaymentSplitter` follows a _pull payment_ model. This means that
/// payments are not
/// automatically forwarded to the accounts but kept in this contract, and the
/// actual transfer
/// is triggered asa separate step by calling the {release} function.

/// @dev This contract assumes that ERC20 tokens will behave similarly to native
/// tokens (Ether).
/// Rebasing tokens, and tokens that apply fees during transfers, are likely to
/// not be supported
/// as expected. If in doubt, we encourage you to run tests before sending real
/// value to this
/// contract.

contract SplitterImpl is SplitterEventsAndErrors {
    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @dev Native token
    uint256 public totalShares;

    uint256 private _totalReleased;
    mapping(address => uint256) private _released;

    /// @dev ERC20 token

    mapping(IERC20 => uint256) private _erc20TotalReleased;
    mapping(IERC20 => mapping(address => uint256)) private _erc20Released;

    /// @dev Native public getters provided.
    mapping(address => uint256) public _shares;
    address[] public _payees;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    /// @notice Creates an instance of `PaymentSplitter` where
    /// each account in `payees` is assigned the number of
    /// shares at the matching position in the `shares` array.
    /// @dev All addresses in `payees` must be non-zero. Both
    /// arrays must have the same non-zero length, and there
    /// must be no duplicates in `payees`.
    /// @dev No risk of loop overflow since payees are bounded
    /// by factory parameters.
    constructor(address[] memory payees, uint256[] memory shares_) payable {
        uint256 pLen = payees.length;

        if (pLen != shares_.length) {
            revert LengthMismatch();
        }
        if (pLen == 0) {
            revert NoPayees();
        }

        for (uint256 i; i < pLen; ++i) {
            _addPayee(payees[i], shares_[i]);
        }
    }

    ////////////////////////////////////////////////////////////////
    //                         RECEIVE LOGIC                      //
    ////////////////////////////////////////////////////////////////

    /// @notice Push receive logic that Liquidates pending
    /// releasable balances each time it receives funds.
    /// @dev The Ether received will be logged with
    /// {PaymentReceived} events.
    /// @dev Note that these events are not fully reliable:
    /// it's possible for a contract to receive Ether
    /// without triggering this function. All releasable
    /// balances can also be released by public pull methods.
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    ////////////////////////////////////////////////////////////////
    //                       PUBLIC PULL FX                       //
    ////////////////////////////////////////////////////////////////

    /// @dev Triggers a transfer to `account` of the amount of
    /// Ether they are owed, according to their percentage of
    /// the total shares and their previous withdrawals.
    function release(address payable account) public {
        if (_shares[account] < 1) {
            revert NoShares();
        }
        uint256 payment = releasable(account);
        if (payment < 1) {
            revert DeniedAccount();
        }
        /// audit GAS
        _released[account] = _released[account] + payment;
        _totalReleased = _totalReleased + payment;

        SafeTransferLib.safeTransferETH(account, payment);

        emit PaymentReleased(account, payment);
    }

    /// @dev Release all pending withdrawals.
    function releaseAll() public {
        uint256 _payeesLength = _payees.length;
        address addr;
        for (uint256 i = 0; i < _payeesLength; ++i) {
            uint256 rel = releasable(addr);
            if (rel != 0) {
                release(payable(addr));
            }
        }
    }

    /// @dev Triggers a transfer to `account` of the amount of `token` tokens
    /// they are owed, according to their percentage of the total shares and
    /// their previous withdrawals. `token` must be the address of an ERC20
    /// contract.
    function release(IERC20 token, address account) public {
        if (_shares[account] == 0) {
            revert NoShares();
        }
        uint256 payment = releasable(token, account);
        if (payment == 0) {
            revert DeniedAccount();
        }

        _erc20Released[token][account] += payment;
        _erc20TotalReleased[token] += payment;

        SafeTransferLib.safeTransfer(token, account, payment);

        emit ERC20PaymentReleased(address(token), account, payment);
    }

    /// @dev Release all pending withdrawals.
    function releaseAll(IERC20 token) public {
        uint256 _payeesLength = _payees.length;
        for ( uint256 i = 0; i < _payeesLength; ++i) {
            address addr = _payees[i];
            uint256 rel = releasable(token, addr);
            if (rel != 0) {
                release(token, payable(addr));
        }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                       PRIVATE HELPERS                      //
    ////////////////////////////////////////////////////////////////

    /// @dev internal logic for computing the pending payment of
    /// an `account`, given the token historical balances and
    /// already released amounts.
    function _pendingPayment(
        address account,
        uint256 totalReceived,
        uint256 alreadyReleased
    ) private view returns (uint256) {
        return
            ((totalReceived * _shares[account]) / totalShares) - alreadyReleased;
    }

    /// @dev Add a new payee to the contract.
    /// @param account The address of the payee to add.
    /// @param shares_ The number of shares owned by the payee.
    function _addPayee(address account, uint256 shares_) private {
        if (account == address(0)) {
            revert DeadAddress();
        }
        if (shares_ == 0) {
            revert InvalidShare();
        }
        if (_shares[account] != 0) {
            revert AlreadyPayee();
        }

        _payees.push(account);
        _shares[account] = shares_;
        totalShares = totalShares + shares_;

        emit PayeeAdded(account, shares_);
    }

    ////////////////////////////////////////////////////////////////
    //                        PUBLIC GETTERS                      //
    ////////////////////////////////////////////////////////////////

    /// @dev Getter for the amount of payee's releasable Ether.
    function releasable(address account) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased();
        return _pendingPayment(account, totalReceived, released(account));
    }

    /// @dev Getter for the amount of payee's releasable
    /// `token` tokens.
    /// @dev `token` should be the address of an ERC20 contract.
    function releasable(IERC20 token, address account)
        public
        view
        returns (uint256)
    {
        uint256 totalReceivedERC20 =
            token.balanceOf(address(this)) + totalReleased(token);
        return _pendingPayment(
            account, totalReceivedERC20, released(token, account)
        );
    }

    /// @dev Getter for `_payees.length`.
    function payeesLength() public view returns (uint256) {
        return _payees.length;
    }

    /// @dev Getter for the total amount of Ether already released.
    function totalReleased() public view returns (uint256) {
        return _totalReleased;
    }

    /// @dev Getter for the total amount of `token`
    /// already released.
    /// @dev `token` should be the address of an ERC20 contract.
    function totalReleased(IERC20 token) public view returns (uint256) {
        return _erc20TotalReleased[token];
    }

    /// @dev Getter for the amount of Ether already
    /// released to a payee.
    function released(address account) public view returns (uint256) {
        return _released[account];
    }

    /// @dev Getter for the amount of `token` tokens already
    /// released to a payee.
    /// @dev `token` should be the address of an ERC20 contract.
    function released(IERC20 token, address account)
        public
        view
        returns (uint256)
    {
        return _erc20Released[token][account];
    }
}
