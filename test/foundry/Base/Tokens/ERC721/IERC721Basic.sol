// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { IImplBase } from "test/foundry/Base/Tokens/common/IImplBase.sol";

interface IERC721Basic is IImplBase {
    // View Functions

    function balanceOf(address owner) external view returns (uint256 result);

    function getApproved(uint256 id) external view returns (address result);

    function name() external view returns (string memory);

    function ownerOf(uint256 id) external view returns (address result);

    function symbol() external view returns (string memory);

    function tokenURI(uint256 id) external view returns (string memory);

    // Other Functions
    function approve(address account, uint256 id) external;

    function burn(uint128[] memory ids) external payable;

    function mint(uint128 amount) external payable;

    function mintTo(address to, uint128 amount) external payable;

    function safeTransferFrom(address from, address to, uint256 id) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes memory data
    ) external;

    function transferFrom(address from, address to, uint256 id) external;

    function withdraw() external payable;

    function withdrawERC20(address erc20) external;

    function publicMintLimit() external view returns (uint256);

    function setPublicMintLimit(uint256 limit) external;

    struct PublicMintValues {
        bool publicMintState;
        uint256 price;
        uint256 limit;
        uint256 startDate;
        uint256 endDate;
    }

    function setPublicMintValues(PublicMintValues memory values) external;
}
