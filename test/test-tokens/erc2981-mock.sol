// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import { ERC2981 } from "contracts/lib/tokens/common/ERC2981.sol";
import { Owned } from "contracts/lib/auth/Owned.sol";

contract MockERC2981 is ERC2981, Owned(msg.sender) {
    address public _royaltyRecipient;

    event RoyaltyRecipientSet(address indexed newRecipient);
    event RoyaltyFeeSet(uint256 indexed newRoyaltyFee);

    constructor(uint256 fee, address recipient) ERC2981(fee) {
        setRoyaltyRecipient(recipient);
        // setRoyaltyFee(fee);
        emit RoyaltyFeeSet(_royaltyFee);
    }

    function setRoyaltyRecipient(address recipient) public onlyOwner {
        _royaltyRecipient = recipient;

        emit RoyaltyRecipientSet(_royaltyRecipient);
    }

    // function setRoyaltyFee(uint256 fee) public onlyOwner {
    //     royaltyFee = fee;

    //     emit RoyaltyFeeSet(royaltyFee);
    // }

    function royaltyInfo(uint256, uint256 salePrice)
        public
        view
        virtual
        override(ERC2981)
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver = payable(_royaltyRecipient);
        royaltyAmount = (salePrice * _royaltyFee) / 10_000;
    }
}
