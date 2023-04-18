// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { ERC2981 } from "../tokens/common/ERC2981.sol";
import { Owned } from "../auth/Owned.sol";

contract MockERC2981 is ERC2981, Owned(msg.sender) {
    event RoyaltyRecipientSet(address indexed newRecipient);
    event RoyaltyFeeSet(uint256 indexed newRoyaltyFee);

    constructor(uint256 fee, address recipient) ERC2981() {
        setRoyaltyRecipient(recipient);
        setRoyaltyFee(fee);
    }

    function setRoyaltyRecipient(address recipient) public onlyOwner {
        _royaltyRecipient = recipient;

        emit RoyaltyRecipientSet(_royaltyRecipient);
    }

    function setRoyaltyFee(uint256 fee) public onlyOwner {
        _royaltyFee = fee;

        emit RoyaltyFeeSet(_royaltyFee);
    }
}
