# ERC721Lazy

## Methods

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### \_verify

```solidity
function _verify(Types.Voucher _voucher, uint8 v, bytes32 r, bytes32 s) external view returns (address recovered)
```

#### Parameters

| Name      | Type          | Description |
| --------- | ------------- | ----------- |
| \_voucher | Types.Voucher | undefined   |
| v         | uint8         | undefined   |
| r         | bytes32       | undefined   |
| s         | bytes32       | undefined   |

#### Returns

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| recovered | address | undefined   |

### \_verifyVoucher

```solidity
function _verifyVoucher(Types.Voucher _voucher, uint8 v, bytes32 r, bytes32 s) external view returns (address recovered)
```

#### Parameters

| Name      | Type          | Description |
| --------- | ------------- | ----------- |
| \_voucher | Types.Voucher | undefined   |
| v         | uint8         | undefined   |
| r         | bytes32       | undefined   |
| s         | bytes32       | undefined   |

#### Returns

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| recovered | address | undefined   |

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

### lazyMint

```solidity
function lazyMint(Types.Voucher voucher, uint8 v, bytes32 r, bytes32 s) external payable
```

#### Parameters

| Name    | Type          | Description |
| ------- | ------------- | ----------- |
| voucher | Types.Voucher | undefined   |
| v       | uint8         | undefined   |
| r       | bytes32       | undefined   |
| s       | bytes32       | undefined   |

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

### setOwner

```solidity
function setOwner(address newOwner) external nonpayable
```

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### setSigner

```solidity
function setSigner(address _signer) external nonpayable
```

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| \_signer | address | undefined   |

### signer

```solidity
function signer() external view returns (address)
```

The signer address used for lazy minting voucher validation.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

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

### usedVouchers

```solidity
function usedVouchers(bytes32) external view returns (bool)
```

Mapping for used vouchers.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

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

### OwnerUpdated

```solidity
event OwnerUpdated(address indexed user, address indexed newOwner)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| user `indexed`     | address | undefined   |
| newOwner `indexed` | address | undefined   |

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

### SignerUpdated

```solidity
event SignerUpdated(address indexed newSigner)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| newSigner `indexed` | address | undefined   |

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

## Errors

### InvalidSigner

```solidity
error InvalidSigner()
```

_0x815e1d64_

### NotMintedYet

```solidity
error NotMintedYet()
```

_0xbad086ea_

### BaseURILocked

```solidity
error BaseURILocked()
```

_?_

### UsedVoucher

```solidity
error UsedVoucher()
```

_0xe647f413_

### WrongPrice

```solidity
error WrongPrice()
```

_0xf7760f25_
