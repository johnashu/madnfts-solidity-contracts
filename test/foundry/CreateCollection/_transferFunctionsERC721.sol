pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import { IERC721Basic } from "test/foundry/Base/Tokens/ERC721/IERC721Basic.sol";
import { ICollection } from "test/foundry/CreateCollection/ICollection.sol";

abstract contract ERC721TransferFunctions is Test {
    function _checkOwnerOf(address _owner, ICollection.MintData memory mintData)
        internal
        view
        returns (bool ownsAll)
    {
        ownsAll = true;
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);
        for (
            uint256 i = mintData.newTotalSupply;
            i > mintData.totalSupplyBefore;
            --i
        ) {
            // Check that the nftReceiver is the Owner
            if (collection.ownerOf(i) != _owner) {
                ownsAll = false;
            }
        }
    }

    function _transferTokens(
        address _from,
        address _to,
        ICollection.MintData memory mintData,
        bytes memory data,
        bool isSafe,
        bool withData
    ) internal {
        vm.startPrank(_from);
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);

        for (
            uint256 i = mintData.newTotalSupply;
            i > mintData.totalSupplyBefore;
            --i
        ) {
            if (isSafe) {
                if (withData) {
                    collection.safeTransferFrom(_from, _to, i, data);
                } else {
                    collection.safeTransferFrom(_from, _to, i);
                }
            } else {
                collection.transferFrom(_from, _to, i);
            }
        }
        vm.stopPrank();
    }

    function _checkBalancesAndOwnership(
        ICollection.MintData memory mintData,
        address receiver,
        address friend,
        uint256 expectedReceiverBalance,
        uint256 expectedFriendBalance,
        bool expectedReceiverOwnership
    ) internal {
        IERC721Basic collection = IERC721Basic(mintData.collectionAddress);

        // Check that receiver has the expected balance
        assertTrue(
            collection.balanceOf(receiver) == expectedReceiverBalance,
            "collection.balanceOf(receiver) == expectedReceiverBalance ::  do not match"
        );
        assertTrue(
            _checkOwnerOf(receiver, mintData) == expectedReceiverOwnership,
            "checkOwnerOf(receiver, mintData) == expectedReceiverOwnership ::  do not match"
        );

        // Check that friend has the expected balance
        assertTrue(
            collection.balanceOf(friend) == expectedFriendBalance,
            "collection.balanceOf(friend) == expectedFriendBalance ::  do not match"
        );
        assertTrue(
            _checkOwnerOf(friend, mintData) != expectedReceiverOwnership,
            "_checkOwnerOf(friend, mintData) != expectedReceiverOwnership ::  do not match"
        );

        // Check the totalSupply of the collection has NOT increased
        assertTrue(
            collection.totalSupply() == mintData.newTotalSupply,
            "collection.totalSupply() == mintData.newTotalSupply ::  do not match"
        );
    }

    function _transferCheck(
        ICollection.MintData memory mintData,
        bool isSafe,
        bool withData,
        bytes memory data
    ) internal {
        address friend = makeAddr("friend");
        vm.deal(friend, 1000 ether);

        // Send tokens to 'Friend'
        _transferTokens(
            mintData.nftReceiver, friend, mintData, data, isSafe, withData
        );

        _checkBalancesAndOwnership(
            mintData,
            mintData.nftReceiver,
            friend,
            mintData.balanceNftReceiverBefore,
            mintData.amountToMint,
            false
        );

        // Send token back to nftReceiver
        _transferTokens(
            friend, mintData.nftReceiver, mintData, data, isSafe, withData
        );

        _checkBalancesAndOwnership(
            mintData,
            mintData.nftReceiver,
            friend,
            mintData.balanceNftReceiverBefore + mintData.amountToMint,
            0,
            true
        );
    }

    function _checkTransferFrom(ICollection.MintData memory mintData)
        internal
    {
        _transferCheck(mintData, false, false, "");
    }

    function _checkSafeTransferFrom(ICollection.MintData memory mintData)
        internal
    {
        _transferCheck(mintData, true, false, "");
    }

    function _checkSafeTransferFromWithData(
        ICollection.MintData memory mintData
    ) internal {
        bytes memory data = "SomeDataToSend";
        _transferCheck(mintData, true, true, data);
    }
}
