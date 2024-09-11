pragma solidity 0.8.23;

import "test/lib/forge-std/src/Test.sol";
import { IERC1155Basic } from
    "test/foundry/Base/Tokens/ERC1155/IERC1155Basic.sol";
import { ICollection } from "test/foundry/CreateCollection/ICollection.sol";

abstract contract ERC1155TransferFunctions is Test {
    function _checkOwnerOf1155(
        address _owner,
        ICollection.MintData memory mintData,
        uint256 tokenId
    ) internal view returns (bool ownsAll) {
        ownsAll = true;
        IERC1155Basic collection = IERC1155Basic(mintData.collectionAddress);
        uint256 amount = mintData.newTotalSupply - mintData.totalSupplyBefore;
        if (collection.balanceOf(_owner, tokenId) == 0) {
            ownsAll = false;
        }
    }

    function _transferTokens1155(
        address _from,
        address _to,
        ICollection.MintData memory mintData,
        bytes memory data,
        bool withData,
        uint256 tokenId
    ) internal {
        vm.startPrank(_from);
        IERC1155Basic collection = IERC1155Basic(mintData.collectionAddress);

        if (withData) {
            collection.safeTransferFrom(
                _from, _to, tokenId, mintData.amountToMint, data
            );
        } else {
            collection.safeTransferFrom(
                _from, _to, tokenId, mintData.amountToMint, ""
            );
        }

        vm.stopPrank();
    }

    function _checkBalancesAndOwnership1155(
        ICollection.MintData memory mintData,
        address receiver,
        address friend,
        uint256 expectedReceiverBalance,
        uint256 expectedFriendBalance,
        bool expectedReceiverOwnership,
        uint256 tokenId
    ) internal {
        IERC1155Basic collection = IERC1155Basic(mintData.collectionAddress);

        // Check that receiver has the expected balance
        assertTrue(
            collection.balanceOf(receiver, tokenId) == expectedReceiverBalance,
            "collection.balanceOf(receiver) == expectedReceiverBalance ::  do not match"
        );
        assertTrue(
            _checkOwnerOf1155(receiver, mintData, tokenId)
                == expectedReceiverOwnership,
            "checkOwnerOf(receiver, mintData) == expectedReceiverOwnership ::  do not match"
        );

        // Check that friend has the expected balance
        assertTrue(
            collection.balanceOf(friend, tokenId) == expectedFriendBalance,
            "collection.balanceOf(friend) == expectedFriendBalance ::  do not match"
        );

        assertTrue(
            _checkOwnerOf1155(friend, mintData, tokenId)
                != expectedReceiverOwnership,
            "_checkOwnerOf1155(friend, mintData) != expectedReceiverOwnership ::  do not match"
        );

        // Check the totalSupply of the collection has NOT increased
        // plus 1 for the mintTo single used to set the max supply
        assertTrue(
            collection.totalSupply(tokenId) == mintData.newTotalSupply,
            "collection.totalSupply(tokenId) == mintData.newTotalSupply ::  do not match"
        );
    }

    function _transferCheck1155(
        ICollection.MintData memory mintData,
        bool withData,
        bytes memory data,
        uint256 tokenId
    ) internal {
        address friend = makeAddr("friend");
        vm.deal(friend, 1000 ether);

        // Send tokens to 'Friend'
        _transferTokens1155(
            mintData.nftReceiver, friend, mintData, data, withData, tokenId
        );

        _checkBalancesAndOwnership1155(
            mintData,
            mintData.nftReceiver,
            friend,
            mintData.balanceNftReceiverBefore,
            mintData.amountToMint,
            false,
            tokenId
        );

        // Send token back to nftReceiver
        _transferTokens1155(
            friend, mintData.nftReceiver, mintData, data, withData, tokenId
        );

        _checkBalancesAndOwnership1155(
            mintData,
            mintData.nftReceiver,
            friend,
            mintData.balanceNftReceiverBefore + mintData.amountToMint,
            0,
            true,
            tokenId
        );
    }

    function _checkTransferFrom1155(
        ICollection.MintData memory mintData,
        uint256 tokenId
    ) internal {
        _transferCheck1155(mintData, false, "", tokenId);
    }

    function _checkSafeTransferFrom1155(
        ICollection.MintData memory mintData,
        uint256 tokenId
    ) internal {
        _transferCheck1155(mintData, false, "", tokenId);
    }

    function _checkSafeTransferFromWithData1155(
        ICollection.MintData memory mintData,
        uint256 tokenId
    ) internal {
        bytes memory data = "SomeDataToSend";
        _transferCheck1155(mintData, true, data, tokenId);
    }
}
