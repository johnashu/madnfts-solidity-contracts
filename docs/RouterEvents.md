# RouterEvents

## Events

### baseURI

```solidity
event BaseURI(bytes32 indexed _id, string indexed _baseURI)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| \_id `indexed`      | bytes32 | undefined   |
| \_baseURI `indexed` | string  | undefined   |

### FeesUpdated

```solidity
event FeesUpdated(uint256 burnFees, uint256 mintFees)
```

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| burnFees | uint256 | undefined   |
| mintFees | uint256 | undefined   |

### FreeClaimState

```solidity
event FreeClaimState(bytes32 indexed _id, uint8 indexed _type, bool indexed _state)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| \_id `indexed`    | bytes32 | undefined   |
| \_type `indexed`  | uint8   | undefined   |
| \_state `indexed` | bool    | undefined   |

### PaymentTokenUpdated

```solidity
event PaymentTokenUpdated(address indexed newPaymentToken)
```

#### Parameters

| Name                      | Type    | Description |
| ------------------------- | ------- | ----------- |
| newPaymentToken `indexed` | address | undefined   |

### PublicMintState

```solidity
event PublicMintState(bytes32 indexed _id, uint8 indexed _type, bool indexed _state)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| \_id `indexed`    | bytes32 | undefined   |
| \_type `indexed`  | uint8   | undefined   |
| \_state `indexed` | bool    | undefined   |

### RecipientUpdated

```solidity
event RecipientUpdated(address indexed newRecipient)
```

#### Parameters

| Name                   | Type    | Description |
| ---------------------- | ------- | ----------- |
| newRecipient `indexed` | address | undefined   |

### TokenFundsWithdrawn

```solidity
event TokenFundsWithdrawn(bytes32 indexed _id, uint8 indexed _type, address indexed _payee)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| \_id `indexed`    | bytes32 | undefined   |
| \_type `indexed`  | uint8   | undefined   |
| \_payee `indexed` | address | undefined   |

### WhitelistMintState

```solidity
event WhitelistMintState(bytes32 indexed _id, uint8 indexed _type, bool indexed _state)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| \_id `indexed`    | bytes32 | undefined   |
| \_type `indexed`  | uint8   | undefined   |
| \_state `indexed` | bool    | undefined   |

## Errors

### WrongPrice

```solidity
error WrongPrice()
```

_0xf7760f25_
