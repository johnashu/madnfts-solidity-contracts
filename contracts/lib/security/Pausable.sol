// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

/// @author Modified from OpenZeppelin Contracts
/// (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol)

/// @dev Contract module which allows children to implement an emergency stop
/// mechanism that can be triggered by an authorized account.
/// This module is used through inheritance. It will make available the
/// modifiers `whenNotPaused` and `whenPaused`, which can be applied to
/// the functions of your contract. Note that they will not be pausable by
/// simply including this module, only once the modifiers are put in place.

abstract contract Pausable {
    event Paused(address account);
    event Unpaused(address account);

    bool private _paused;

    constructor() {
        _paused = false;
    }

    function paused() public view virtual returns (bool) {
        return _paused;
    }

    modifier whenNotPaused() {
        require(!paused(), "PAUSED");
        _;
    }

    modifier whenPaused() {
        require(paused(), "UNPAUSED");
        _;
    }

    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }
}
