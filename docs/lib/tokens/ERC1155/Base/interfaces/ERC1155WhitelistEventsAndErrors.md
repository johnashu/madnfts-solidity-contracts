# ERC1155WhitelistEventsAndErrors

## Events

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
