// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.19;

import { ImplBase, SplitterImpl, ERC20, ERC2981, Counters, Strings, SafeTransferLib } from "contracts/MADTokens/common/ImplBase.sol";
import { ERC1155B as ERC1155, ERC1155TokenReceiver } from "contracts/lib/tokens/ERC1155/Base/ERC1155B.sol";

contract ERC1155Basic is ImplBase, ERC1155, ERC1155TokenReceiver {
    using Counters for Counters.Counter;
    using Strings for uint256;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(
        string memory _baseURI,
        uint256 _price,
        uint256 _maxSupply,
        SplitterImpl _splitter,
        uint96 _fraction,
        address _router,
        ERC20 _erc20
    ) ImplBase(_baseURI, _price, _maxSupply, _splitter, _fraction, _router, _erc20) {}

    ////////////////////////////////////////////////////////////////
    //                       OWNER MINTING                        //
    ////////////////////////////////////////////////////////////////

    function mintTo(
        address to,
        uint256 amount,
        uint256[] memory balance,
        address erc20Owner
    ) external payable nonReentrant onlyOwner hasReachedMax(_sumAmounts(balance) * amount) {
        _paymentCheck(erc20Owner, 0);
        uint256 i;
        // for (uint256 i = 0; i < amount; i++) {
        for (i; i < amount; ) {
            _mint(to, _incrementCounter(1), balance[i], "");
            unchecked {
                ++i;
            }
        }

        assembly {
            if lt(i, amount) {
                // LoopOverflow()
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        // Transfer event emited by parent ERC1155 contract
    }

    function mintBatchTo(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        address erc20Owner
    ) external payable onlyOwner hasReachedMax(_sumAmounts(amounts)) {
        _paymentCheck(erc20Owner, 0);
        uint256 i;
        uint256 len = ids.length;
        for (i; i < len; ) {
            liveSupply.increment(amounts[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        _batchMint(to, ids, amounts, "");
        // Transfer event emited by parent ERC1155 contract
    }

    function burn(
        address[] memory from,
        uint256[] memory ids,
        uint256[] memory balances,
        address erc20Owner
    ) external payable onlyOwner {
        _paymentCheck(erc20Owner, 1);
        uint256 i;
        uint256 len = ids.length;
        require(from.length == ids.length && ids.length == balances.length, "LENGTH_MISMATCH");
        for (i; i < len; ) {
            liveSupply.decrement(balances[i]);
            _burn(from[i], ids[i], balances[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        // Transfer events emited by parent ERC1155 contract
    }

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts,
        address erc20Owner
    ) external payable onlyOwner {
        require(ids.length == amounts.length, "LENGTH_MISMATCH");
        _paymentCheck(erc20Owner, 1);
        uint256 i;
        uint256 len = ids.length;
        for (i; i < len; ) {
            liveSupply.decrement(amounts[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        _batchBurn(from, ids, amounts);
        // Transfer event emited by parent ERC1155 contract
    }

    ////////////////////////////////////////////////////////////////
    //                          PUBLIC FX                         //
    ////////////////////////////////////////////////////////////////

    function mint(
        uint256 amount,
        uint256 balance
    )
        external
        payable
        nonReentrant
        publicMintAccess
        hasReachedMax(amount * balance)
        publicMintPriceCheck(price, amount)
    {
        _paymentCheck(msg.sender, 2);
        uint256 i;
        for (i; i < amount; ) {
            _mint(msg.sender, _incrementCounter(1), balance, "");
            unchecked {
                ++i;
            }
        }
        // assembly overflow check
        assembly {
            if lt(i, amount) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        // Transfer events emited by parent ERC1155 contract
    }

    function mintBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    )
        external
        payable
        nonReentrant
        publicMintAccess
        hasReachedMax(_sumAmounts(amounts))
        publicMintPriceCheck(price, ids.length)
    {
        require(ids.length == amounts.length, "MISMATCH_LENGTH");
        uint256 value = _getPriceValue(msg.sender);
        uint256 len = ids.length;
        if (address(erc20) != address(0)) {
            SafeTransferLib.safeTransferFrom(erc20, msg.sender, address(this), value);
        }
        uint256 i;
        for (i; i < len; ) {
            _incrementCounter(amounts[i]);
            unchecked {
                ++i;
            }
        }
        assembly {
            if lt(i, len) {
                mstore(0x00, 0xdfb035c9)
                revert(0x1c, 0x04)
            }
        }
        _batchMint(msg.sender, ids, amounts, "");
        // Transfer event emited by parent ERC1155 contract
    }

    function _sumAmounts(uint256[] memory amounts) private pure returns (uint256 _result) {
        uint256 len = amounts.length;
        uint256 i;
        for (i; i < len; ) {
            _result += amounts[i];
            unchecked {
                ++i;
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           VIEW FX                          //
    ////////////////////////////////////////////////////////////////

    function uri(uint256 id) public view virtual override returns (string memory) {
        if (id > mintCount) {
            // revert("NotMintedYet");
            assembly {
                mstore(0x00, 0xbad086ea)
                revert(0x1c, 0x04)
            }
        }
        return string(abi.encodePacked(baseURI, Strings.toString(id), ".json"));
    }

    ////////////////////////////////////////////////////////////////
    //                     REQUIRED OVERRIDES                     //
    ////////////////////////////////////////////////////////////////

    function supportsInterface(bytes4 interfaceId) public pure virtual override(ERC2981) returns (bool) {
        return
            // ERC165 Interface ID for ERC165
            interfaceId == 0x01ffc9a7 ||
            // ERC165 Interface ID for ERC1155
            interfaceId == 0xd9b67a26 ||
            // ERC165 Interface ID for ERC1155MetadataURI
            interfaceId == 0x0e89341c ||
            // ERC165 Interface ID for ERC2981
            interfaceId == 0x2a55205a;
    }
}
