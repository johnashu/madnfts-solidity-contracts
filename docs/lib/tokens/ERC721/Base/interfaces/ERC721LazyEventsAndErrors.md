# ERC721LazyEventsAndErrors

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
