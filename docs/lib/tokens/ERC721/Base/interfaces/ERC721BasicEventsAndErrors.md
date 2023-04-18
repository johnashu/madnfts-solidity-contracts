# ERC721BasicEventsAndErrors

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
