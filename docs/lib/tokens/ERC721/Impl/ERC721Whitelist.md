# ERC721Whitelist

## Methods

### approve

```solidity
function approve(address spender, uint256 id) external nonpayable
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| spender | address | undefined   |
| id      | uint256 | undefined   |

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```

#### Parameters

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| owner | address | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### baseURILock

```solidity
function baseURILock() external view returns (bool)
```

Lock the URI default := false.

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### burn

```solidity
function burn(uint256[] ids, address erc20Owner) external payable
```

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| ids        | uint256[] | undefined   |
| erc20Owner | address   | undefined   |

### claimFree

```solidity
function claimFree(bytes32[] merkleProof) external nonpayable
```

#### Parameters

| Name        | Type      | Description |
| ----------- | --------- | ----------- |
| merkleProof | bytes32[] | undefined   |

### claimListMerkleRoot

```solidity
function claimListMerkleRoot() external view returns (bytes32)
```

Claim merkel.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### claimed

```solidity
function claimed(address) external view returns (bool)
```

_Stores the amount of whitelist minted tokens of an address.For fetching purposes and max free claim control._

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### erc20

```solidity
function erc20() external view returns (contract ERC20)
```

ERC20 payment token address.

#### Returns

| Name | Type           | Description |
| ---- | -------------- | ----------- |
| \_0  | contract ERC20 | undefined   |

### feeCount

```solidity
function feeCount() external view returns (uint256)
```

Fee counter.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### freeAmount

```solidity
function freeAmount() external view returns (uint256)
```

Default amount to be claimed as free in a collection.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### freeClaimState

```solidity
function freeClaimState() external view returns (bool)
```

True to enable free claiming default := false.

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### freeConfig

```solidity
function freeConfig(uint256 _freeAmount, uint256 _maxFree, bytes32 _claimListMerkleRoot) external nonpayable
```

#### Parameters

| Name                  | Type    | Description |
| --------------------- | ------- | ----------- |
| \_freeAmount          | uint256 | undefined   |
| \_maxFree             | uint256 | undefined   |
| \_claimListMerkleRoot | bytes32 | undefined   |

### freeSupply

```solidity
function freeSupply() external view returns (uint256)
```

Claim available supply.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### getApproved

```solidity
function getApproved(uint256) external view returns (address)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### baseURI

```solidity
function baseURI() external view returns (string)
```

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### mintCount

```solidity
function mintCount() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### giftTokens

```solidity
function giftTokens(address[] addresses, address erc20Owner) external payable
```

_Mints one token per address.Allows erc20 payments only if erc20 exists_

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| addresses  | address[] | undefined   |
| erc20Owner | address   | undefined   |

### isApprovedForAll

```solidity
function isApprovedForAll(address, address) external view returns (bool)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### maxFree

```solidity
function maxFree() external view returns (uint256)
```

Claim max supply.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### maxSupply

```solidity
function maxSupply() external view returns (uint256)
```

Capped max supply.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### maxWhitelistSupply

```solidity
function maxWhitelistSupply() external view returns (uint256)
```

Whitelist max supply.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### mint

```solidity
function mint(uint256 amount) external payable
```

_Public minting_

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| amount | uint256 | undefined   |

### mintToCreator

```solidity
function mintToCreator(uint256 amount, address erc20Owner) external payable
```

#### Parameters

| Name       | Type    | Description |
| ---------- | ------- | ----------- |
| amount     | uint256 | undefined   |
| erc20Owner | address | undefined   |

### name

```solidity
function name() external view returns (string)
```

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### onERC721Received

```solidity
function onERC721Received(address, address, uint256, bytes) external nonpayable returns (bytes4)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | address | undefined   |
| \_2  | uint256 | undefined   |
| \_3  | bytes   | undefined   |

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | bytes4 | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### ownerOf

```solidity
function ownerOf(uint256 id) external view returns (address owner)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| id   | uint256 | undefined   |

#### Returns

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| owner | address | undefined   |

### publicMintState

```solidity
function publicMintState() external view returns (bool)
```

_default := false._

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### publicPrice

```solidity
function publicPrice() external view returns (uint256)
```

Public mint price.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### royaltyInfo

```solidity
function royaltyInfo(uint256, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount)
```

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| \_0       | uint256 | undefined   |
| salePrice | uint256 | undefined   |

#### Returns

| Name          | Type    | Description |
| ------------- | ------- | ----------- |
| receiver      | address | undefined   |
| royaltyAmount | uint256 | undefined   |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id) external nonpayable
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| from | address | undefined   |
| to   | address | undefined   |
| id   | uint256 | undefined   |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, bytes data) external nonpayable
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| from | address | undefined   |
| to   | address | undefined   |
| id   | uint256 | undefined   |
| data | bytes   | undefined   |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external nonpayable
```

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| operator | address | undefined   |
| approved | bool    | undefined   |

### setBaseURI

```solidity
function setBaseURI(string _baseURI) external nonpayable
```

#### Parameters

| Name      | Type   | Description |
| --------- | ------ | ----------- |
| \_baseURI | string | undefined   |

### setBaseURILock

```solidity
function setBaseURILock() external nonpayable
```

### setFreeClaimState

```solidity
function setFreeClaimState(bool _freeClaimState) external nonpayable
```

#### Parameters

| Name             | Type | Description |
| ---------------- | ---- | ----------- |
| \_freeClaimState | bool | undefined   |

### setOwner

```solidity
function setOwner(address newOwner) external nonpayable
```

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### setPublicMintState

```solidity
function setPublicMintState(bool _publicMintState) external nonpayable
```

#### Parameters

| Name              | Type | Description |
| ----------------- | ---- | ----------- |
| \_publicMintState | bool | undefined   |

### setWhitelistMintState

```solidity
function setWhitelistMintState(bool _whitelistMintState) external nonpayable
```

#### Parameters

| Name                 | Type | Description |
| -------------------- | ---- | ----------- |
| \_whitelistMintState | bool | undefined   |

### splitter

```solidity
function splitter() external view returns (contract SplitterImpl)
```

Splitter address relationship.

#### Returns

| Name | Type                  | Description |
| ---- | --------------------- | ----------- |
| \_0  | contract SplitterImpl | undefined   |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external pure returns (bool)
```

#### Parameters

| Name        | Type   | Description |
| ----------- | ------ | ----------- |
| interfaceId | bytes4 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### symbol

```solidity
function symbol() external view returns (string)
```

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### tokenURI

```solidity
function tokenURI(uint256 id) external view returns (string)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| id   | uint256 | undefined   |

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 id) external nonpayable
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| from | address | undefined   |
| to   | address | undefined   |
| id   | uint256 | undefined   |

### whitelistConfig

```solidity
function whitelistConfig(uint256 _price, uint256 _supply, bytes32 _root) external nonpayable
```

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| \_price  | uint256 | undefined   |
| \_supply | uint256 | undefined   |
| \_root   | bytes32 | undefined   |

### whitelistMerkleRoot

```solidity
function whitelistMerkleRoot() external view returns (bytes32)
```

Whitelist merkel.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### whitelistMint

```solidity
function whitelistMint(uint8 amount, bytes32[] merkleProof) external payable
```

_Public whilist mint_

#### Parameters

| Name        | Type      | Description |
| ----------- | --------- | ----------- |
| amount      | uint8     | undefined   |
| merkleProof | bytes32[] | undefined   |

### whitelistMintState

```solidity
function whitelistMintState() external view returns (bool)
```

_default := false._

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### whitelistMinted

```solidity
function whitelistMinted() external view returns (uint256)
```

_Current whitelist supply._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### whitelistPrice

```solidity
function whitelistPrice() external view returns (uint256)
```

Public whitelist mint price.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### withdraw

```solidity
function withdraw(address recipient) external nonpayable
```

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| recipient | address | undefined   |

### withdrawERC20

```solidity
function withdrawERC20(contract ERC20 _token, address recipient) external nonpayable
```

#### Parameters

| Name      | Type           | Description |
| --------- | -------------- | ----------- |
| \_token   | contract ERC20 | undefined   |
| recipient | address        | undefined   |

## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 indexed id)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| owner `indexed`   | address | undefined   |
| spender `indexed` | address | undefined   |
| id `indexed`      | uint256 | undefined   |

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| owner `indexed`    | address | undefined   |
| operator `indexed` | address | undefined   |
| approved           | bool    | undefined   |

### BaseURILocked

```solidity
event BaseURILocked(string indexed baseURI)
```

#### Parameters

| Name              | Type   | Description |
| ----------------- | ------ | ----------- |
| baseURI `indexed` | string | undefined   |

### BaseURISet

```solidity
event BaseURISet(string indexed newBaseURI)
```

#### Parameters

| Name                 | Type   | Description |
| -------------------- | ------ | ----------- |
| newBaseURI `indexed` | string | undefined   |

### FreeClaimStateSet

```solidity
event FreeClaimStateSet(bool indexed freeClaimState)
```

#### Parameters

| Name                     | Type | Description |
| ------------------------ | ---- | ----------- |
| freeClaimState `indexed` | bool | undefined   |

### FreeConfigSet

```solidity
event FreeConfigSet(uint256 newFreeAmount, uint256 indexed newMaxFree, bytes32 indexed newMerkleRoot)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| newFreeAmount           | uint256 | undefined   |
| newMaxFree `indexed`    | uint256 | undefined   |
| newMerkleRoot `indexed` | bytes32 | undefined   |

### OwnerUpdated

```solidity
event OwnerUpdated(address indexed user, address indexed newOwner)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| user `indexed`     | address | undefined   |
| newOwner `indexed` | address | undefined   |

### PublicMintStateSet

```solidity
event PublicMintStateSet(bool indexed newPublicState)
```

#### Parameters

| Name                     | Type | Description |
| ------------------------ | ---- | ----------- |
| newPublicState `indexed` | bool | undefined   |

### RoyaltyFeeSet

```solidity
event RoyaltyFeeSet(uint256 indexed newRoyaltyFee)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| newRoyaltyFee `indexed` | uint256 | undefined   |

### RoyaltyRecipientSet

```solidity
event RoyaltyRecipientSet(address indexed newRecipient)
```

#### Parameters

| Name                   | Type    | Description |
| ---------------------- | ------- | ----------- |
| newRecipient `indexed` | address | undefined   |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed id)
```

#### Parameters

| Name           | Type    | Description |
| -------------- | ------- | ----------- |
| from `indexed` | address | undefined   |
| to `indexed`   | address | undefined   |
| id `indexed`   | uint256 | undefined   |

### WhitelistConfigSet

```solidity
event WhitelistConfigSet(uint256 indexed newWhitelistPrice, uint256 indexed newMaxWhitelistSupply, bytes32 indexed newMerkleRoot)
```

#### Parameters

| Name                            | Type    | Description |
| ------------------------------- | ------- | ----------- |
| newWhitelistPrice `indexed`     | uint256 | undefined   |
| newMaxWhitelistSupply `indexed` | uint256 | undefined   |
| newMerkleRoot `indexed`         | bytes32 | undefined   |

### WhitelistMintStateSet

```solidity
event WhitelistMintStateSet(bool indexed newWhitelistState)
```

#### Parameters

| Name                        | Type | Description |
| --------------------------- | ---- | ----------- |
| newWhitelistState `indexed` | bool | undefined   |

## Errors

### AddressDenied

```solidity
error AddressDenied()
```

_0x3b8474be_

### AlreadyClaimed

```solidity
error AlreadyClaimed()
```

_0x646cf558_

### FreeClaimClosed

```solidity
error FreeClaimClosed()
```

_0xf44170cb_

### LoopOverflow

```solidity
error LoopOverflow()
```

_0xdfb035c9_

### MaxFreeReached

```solidity
error MaxFreeReached()
```

_0xf90c1bdb_

### MaxMintReached

```solidity
error MaxMintReached()
```

_0xfc3fc71f_

### MaxWhitelistReached

```solidity
error MaxWhitelistReached()
```

_0xa554e6e1_

### NotMintedYet

```solidity
error NotMintedYet()
```

_0xbad086ea_

### PublicMintClosed

```solidity
error PublicMintClosed()
```

_0x2d0a3f8e_

### BaseURILocked

```solidity
error BaseURILocked()
```

_?_

### WhitelistMintClosed

```solidity
error WhitelistMintClosed()
```

_0x700a6c1f_

### WrongPrice

```solidity
error WrongPrice()
```

_0xf7760f25_
