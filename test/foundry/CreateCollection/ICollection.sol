pragma solidity 0.8.23;

interface ICollection {
    struct MintData {
        address nftMinter;
        address nftReceiver;
        uint256 nftPublicMintPrice;
        uint128 amountToMint;
        address collectionAddress;
        address splitterAddress;
        uint256 totalSupplyBefore;
        uint256 newTotalSupply;
        uint256 balanceNftReceiverBefore;
        uint256 balanceNftMinterBefore;
    }
}
