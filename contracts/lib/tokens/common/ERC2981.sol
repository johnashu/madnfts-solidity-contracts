// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

//// @title Minimal ERC2981 (NFT Royalty Standard) implementation.
//// @author Modified from exp.table
// (https://etherscan.io/address/0x0faed6ddef3773f3ee5828383aaeeaca2a94564a#code)

abstract contract ERC2981 {
    // event RoyaltyRecipientSet(address indexed newRecipient);
    // event RoyaltyFeeSet(uint256 indexed newRoyaltyFee);

    /// @dev one global fee for all royalties.
    uint256 public immutable _royaltyFee;

    /// @dev one global recipient for all royalties.
    address internal _royaltyRecipient;

    constructor(uint256 royaltyFee, address royaltyRecipient) {
        _royaltyFee = royaltyFee;
        _royaltyRecipient = royaltyRecipient;
        // emit RoyaltyFeeSet(royaltyFee);
        // emit RoyaltyRecipientSet(royaltyRecipient);
    }

    // solhint-disable-line no-unused-vars
    function royaltyInfo(uint256, uint256 salePrice)
        public
        view
        virtual
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver = _royaltyRecipient;
        royaltyAmount = (salePrice * _royaltyFee) / 10_000;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        pure
        virtual
        returns (bool)
    {
        return interfaceId == 0x01ffc9a7 // ERC165 Interface ID for ERC165
            || interfaceId == 0x2a55205a; // ERC165 Interface ID for ERC2981
    }
}
