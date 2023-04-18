# ERC1155Basic

## Methods

### URILock

```solidity
function URILock() external view returns (bool)
```

Lock the URI default := false.

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### balanceOf

```solidity
function balanceOf(address owner, uint256 id) external view returns (uint256 bal)
```

#### Parameters

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| owner | address | undefined   |
| id    | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| bal  | uint256 | undefined   |

### balanceOfBatch

```solidity
function balanceOfBatch(address[] owners, uint256[] ids) external view returns (uint256[] balances)
```

#### Parameters

| Name   | Type      | Description |
| ------ | --------- | ----------- |
| owners | address[] | undefined   |
| ids    | uint256[] | undefined   |

#### Returns

| Name     | Type      | Description |
| -------- | --------- | ----------- |
| balances | uint256[] | undefined   |

### burn

```solidity
function burn(address[] from, uint256[] ids, uint256[] balances, address erc20Owner) external payable
```

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| from       | address[] | undefined   |
| ids        | uint256[] | undefined   |
| balances   | uint256[] | undefined   |
| erc20Owner | address   | undefined   |

### burnBatch

```solidity
function burnBatch(address from, uint256[] ids, uint256[] amounts, address erc20Owner) external payable
```

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| from       | address   | undefined   |
| ids        | uint256[] | undefined   |
| amounts    | uint256[] | undefined   |
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

### mintCount

```solidity
function mintCount() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### getURI

```solidity
function getURI() external view returns (string)
```

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

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

### maxSupply

```solidity
function maxSupply() external view returns (uint256)
```

Capped max supply.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### mint

```solidity
function mint(uint256 amount, uint256 balance) external payable
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| amount  | uint256 | undefined   |
| balance | uint256 | undefined   |

### mintBatch

```solidity
function mintBatch(uint256[] ids, uint256[] amounts) external payable
```

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| ids     | uint256[] | undefined   |
| amounts | uint256[] | undefined   |

### mintBatchTo

```solidity
function mintBatchTo(address to, uint256[] ids, uint256[] amounts, address erc20Owner) external payable
```

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| to         | address   | undefined   |
| ids        | uint256[] | undefined   |
| amounts    | uint256[] | undefined   |
| erc20Owner | address   | undefined   |

### mintTo

```solidity
function mintTo(address to, uint256 amount, uint256[] balance, address erc20Owner) external payable
```

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| to         | address   | undefined   |
| amount     | uint256   | undefined   |
| balance    | uint256[] | undefined   |
| erc20Owner | address   | undefined   |

### onERC1155BatchReceived

```solidity
function onERC1155BatchReceived(address, address, uint256[], uint256[], bytes) external nonpayable returns (bytes4)
```

#### Parameters

| Name | Type      | Description |
| ---- | --------- | ----------- |
| \_0  | address   | undefined   |
| \_1  | address   | undefined   |
| \_2  | uint256[] | undefined   |
| \_3  | uint256[] | undefined   |
| \_4  | bytes     | undefined   |

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | bytes4 | undefined   |

### onERC1155Received

```solidity
function onERC1155Received(address, address, uint256, uint256, bytes) external nonpayable returns (bytes4)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | address | undefined   |
| \_2  | uint256 | undefined   |
| \_3  | uint256 | undefined   |
| \_4  | bytes   | undefined   |

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
function ownerOf(uint256, address) external view returns (uint256)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |
| \_1  | address | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### price

```solidity
function price() external view returns (uint256)
```

Public mint price.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### publicMintState

```solidity
function publicMintState() external view returns (bool)
```

Public mint state default := false.

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

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

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external nonpayable
```

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| from    | address   | undefined   |
| to      | address   | undefined   |
| ids     | uint256[] | undefined   |
| amounts | uint256[] | undefined   |
| data    | bytes     | undefined   |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external nonpayable
```

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| from   | address | undefined   |
| to     | address | undefined   |
| id     | uint256 | undefined   |
| amount | uint256 | undefined   |
| data   | bytes   | undefined   |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external nonpayable
```

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| operator | address | undefined   |
| approved | bool    | undefined   |

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

### setBaseURI

```solidity
function setBaseURI(string __uri) external nonpayable
```

#### Parameters

| Name    | Type   | Description |
| ------- | ------ | ----------- |
| \_\_uri | string | undefined   |

### setURILock

```solidity
function setURILock() external nonpayable
```

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

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### uri

```solidity
function uri(uint256 id) external view returns (string)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| id   | uint256 | undefined   |

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

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

### TransferBatch

```solidity
event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] amounts)
```

#### Parameters

| Name               | Type      | Description |
| ------------------ | --------- | ----------- |
| operator `indexed` | address   | undefined   |
| from `indexed`     | address   | undefined   |
| to `indexed`       | address   | undefined   |
| ids                | uint256[] | undefined   |
| amounts            | uint256[] | undefined   |

### TransferSingle

```solidity
event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 amount)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| operator `indexed` | address | undefined   |
| from `indexed`     | address | undefined   |
| to `indexed`       | address | undefined   |
| id                 | uint256 | undefined   |
| amount             | uint256 | undefined   |

### URI

```solidity
event URI(string value, uint256 indexed id)
```

#### Parameters

| Name         | Type    | Description |
| ------------ | ------- | ----------- |
| value        | string  | undefined   |
| id `indexed` | uint256 | undefined   |

## Errors

### LoopOverflow

```solidity
error LoopOverflow()
```

_0xdfb035c9_

### MaxSupplyReached

```solidity
error MaxSupplyReached()
```

_0xd05cb609_

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

### WrongPrice

```solidity
error WrongPrice()
```

_0xf7760f25_
