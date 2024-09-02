// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

interface IImplBase {
    // Pure Functions
    function supportsInterface(bytes4 interfaceId)
        external
        pure
        returns (bool);

    // View Functions
    function baseURI() external view returns (string memory);

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool result);

    function totalSupply() external view returns (uint256);

    function _royaltyFee() external view returns (uint256);

    function erc20() external view returns (address);

    function feeCount() external view returns (uint256);

    function feeCountERC20() external view returns (uint256);

    function getOwner() external view returns (address);

    function getRouter() external view returns (address);

    function liveSupply() external view returns (uint256 _liveSupply);

    function maxSupply() external view returns (uint128);

    function mintCount() external view returns (uint256 _mintCount);

    function price() external view returns (uint256);

    function publicMintState() external view returns (bool);

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount);

    function splitter() external view returns (address);

    function uriLock() external view returns (bool);

    // Other Functions
    function setBaseURI(string memory _baseURI) external;

    function setBaseURILock() external;

    function setOwnership(address _owner) external;

    function setRouterHasAuthority(bool _hasAuthority) external;

    function setPublicMintState(bool _publicMintState) external;

    function withdraw(address recipient) external;

    function withdrawERC20(address token, address recipient) external;

    function setApprovalForAll(address operator, bool isApproved) external;
}
