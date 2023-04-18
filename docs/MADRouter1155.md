# MADRouter1155

## Methods

### MADFactory1155

```solidity
function MADFactory1155() external view returns (contract FactoryVerifier)
```

FactoryVerifier connecting the router to MADFactory1155.

#### Returns

| Name | Type                     | Description |
| ---- | ------------------------ | ----------- |
| \_0  | contract FactoryVerifier | undefined   |

### basicMintBatchTo

```solidity
function basicMintBatchTo(address _token, address _to, uint256[] _ids, uint256[] _balances) external payable
```

ERC1155Whitelist mint to creator function handler.

_Function Sighash := 0x182ee485_

#### Parameters

| Name       | Type      | Description                                                     |
| ---------- | --------- | --------------------------------------------------------------- |
| \_token    | address   | 1155 token address.                                             |
| \_to       | address   | undefined                                                       |
| \_ids      | uint256[] | Receiver token \_ids array.                                     |
| \_balances | uint256[] | Receiver token balances array, length should be = \_ids.length. |

### basicMintTo

```solidity
function basicMintTo(address _token, address _to, uint256 _amount, uint256[] _balances) external payable
```

ERC1155Basic creator mint function handler.

_Function Sighash := 0x490f7027_

#### Parameters

| Name       | Type      | Description                                                 |
| ---------- | --------- | ----------------------------------------------------------- |
| \_token    | address   | 1155 token address.                                         |
| \_to       | address   | Receiver token address.                                     |
| \_amount   | uint256   | Num tokens to mint and send.                                |
| \_balances | uint256[] | Receiver token balances array, length should be = \_amount. |

### batchBurn

```solidity
function batchBurn(address _token, address _from, uint256[] _ids, uint256[] _balances) external payable
```

Global token batch burn controller/single pusher for all token types.

_Function Sighash := 0xba36b92d_

#### Parameters

| Name       | Type      | Description                                                                                  |
| ---------- | --------- | -------------------------------------------------------------------------------------------- |
| \_token    | address   | 1155 token address.                                                                          |
| \_from     | address   | Array of addresses who own each token.                                                       |
| \_ids      | uint256[] | The token IDs of each token to be burnt; should be left empty for the `ERC1155Minimal` type. |
| \_balances | uint256[] | Array of corresponding token balances to burn.                                               |

### burn

```solidity
function burn(address _token, uint256[] _ids, address[] to, uint256[] _amount) external payable
```

Global token burn controller/single pusher for all token types.

_Function Sighash := 0xba36b92d_

#### Parameters

| Name     | Type      | Description                                                                                  |
| -------- | --------- | -------------------------------------------------------------------------------------------- |
| \_token  | address   | 1155 token address.                                                                          |
| \_ids    | uint256[] | The token IDs of each token to be burnt; should be left empty for the `ERC1155Minimal` type. |
| to       | address[] | Array of addresses who own each token.                                                       |
| \_amount | uint256[] | Array of receiver token balances array.                                                      |

### creatorBatchMint

```solidity
function creatorBatchMint(address _token, uint256[] _ids, uint256[] _balances, uint256 totalBalance) external payable
```

ERC1155Whitelist batch mint to creator function handler.

_Function Sighash := 0x182ee485_

#### Parameters

| Name         | Type      | Description                                                     |
| ------------ | --------- | --------------------------------------------------------------- |
| \_token      | address   | 1155 token address.                                             |
| \_ids        | uint256[] | Receiver token \_ids array.                                     |
| \_balances   | uint256[] | Receiver token balances array, length should be = \_ids.length. |
| totalBalance | uint256   | Totaled token amounts.                                          |

### creatorMint

```solidity
function creatorMint(address _token, uint256 _amount, uint256[] _balances, uint256 totalBalance) external payable
```

ERC1155Whitelist mint to creator function handler.

_Function Sighash := 0x182ee485_

#### Parameters

| Name         | Type      | Description                                                 |
| ------------ | --------- | ----------------------------------------------------------- |
| \_token      | address   | 1155 token address.                                         |
| \_amount     | uint256   | Num tokens to mint and send.                                |
| \_balances   | uint256[] | Receiver token balances array, length should be = \_amount. |
| totalBalance | uint256   | Totaled token amounts.                                      |

### erc20

```solidity
function erc20() external view returns (contract ERC20)
```

ERC20 payment token address.

#### Returns

| Name | Type           | Description |
| ---- | -------------- | ----------- |
| \_0  | contract ERC20 | undefined   |

### feeBurn

```solidity
function feeBurn() external view returns (uint256)
```

Burn fee store.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### feeLookup

```solidity
function feeLookup(bytes4 sigHash) external view returns (uint256 fee)
```

Mint and burn fee lookup.

_Function Sighash := 0xedc9e7a4_

#### Parameters

| Name    | Type   | Description |
| ------- | ------ | ----------- | ------- |
| sigHash | bytes4 | MINSAFEMINT | MINBURN |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| fee  | uint256 | undefined   |

### feeMint

```solidity
function feeMint() external view returns (uint256)
```

Mint fee store.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### freeSettings

```solidity
function freeSettings(address _token, uint256 _freeAmount, uint256 _maxFree, bytes32 _claimRoot) external nonpayable
```

ERC1155Whitelist free claim config setter.

_Event emitted by ERC1155Whitelist token implementation contracts. Function Sighash := 0xcab2e41f_

#### Parameters

| Name         | Type    | Description                |
| ------------ | ------- | -------------------------- |
| \_token      | address | 1155 token address.        |
| \_freeAmount | uint256 | Num tokens per address.    |
| \_maxFree    | uint256 | Max free tokens available. |
| \_claimRoot  | bytes32 | Merkel root.               |

### gift

```solidity
function gift(address _token, address[] _addresses, uint256[] _balances, uint256 totalBalance) external payable
```

ERC1155Whitelist gift tokens function handler.

_Function Sighash := 0x67b5a642_

#### Parameters

| Name         | Type      | Description                                                     |
| ------------ | --------- | --------------------------------------------------------------- |
| \_token      | address   | 1155 token address.                                             |
| \_addresses  | address[] | Array of addresses to gift too.                                 |
| \_balances   | uint256[] | Receiver token balances array, length should be = \_ids.length. |
| totalBalance | uint256   | Totaled token amounts.                                          |

### maxFeeBurn

```solidity
function maxFeeBurn() external view returns (uint256)
```

max fee that can be set for burn, configured on constructor

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### maxFeeMint

```solidity
function maxFeeMint() external view returns (uint256)
```

max fee that can be set for mint, configured on constructor

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### minimalSafeMint

```solidity
function minimalSafeMint(address _token, address _to, uint256 balance) external payable
```

ERC1155Minimal creator mint function handler.

_Function Sighash := 0x42a42752_

#### Parameters

| Name    | Type    | Description             |
| ------- | ------- | ----------------------- |
| \_token | address | 1155 token address.     |
| \_to    | address | Receiver token address. |
| balance | uint256 | Receiver token balance. |

### name

```solidity
function name() external pure returns (string)
```

Contract name.

_Function Sighash := 0x06fdde03_

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### pause

```solidity
function pause() external nonpayable
```

Paused state initializer for security risk mitigation pratice.

_Function Sighash := 0x8456cb59_

### paused

```solidity
function paused() external view returns (bool)
```

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### recipient

```solidity
function recipient() external view returns (address)
```

_The recipient address used for public mint fees._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### setFees

```solidity
function setFees(uint256 _feeMint, uint256 _feeBurn) external nonpayable
```

Change the Routers mint and burn fees.

_Event emitted by token contract. Function Sighash := 0x0b78f9c0_

#### Parameters

| Name      | Type    | Description   |
| --------- | ------- | ------------- |
| \_feeMint | uint256 | New mint fee. |
| \_feeBurn | uint256 | New burn fee. |

### setMintState

```solidity
function setMintState(address _token, bool _state, uint8 _stateType) external nonpayable
```

Global MintState setter/controller

_Switch cases/control flow handling conditioned by both `_stateType` and `_tokenType`. Events logged by each tokens&#39; `setState` functions. Function Sighash := 0xab9acd57_

#### Parameters

| Name        | Type    | Description                                                                                                                     |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| \_token     | address | 1155 token address.                                                                                                             |
| \_state     | bool    | Set state to true or false.                                                                                                     |
| \_stateType | uint8   | Values: 0 := PublicMintState (minimal, basic, whitelist); 1 := WhitelistMintState (whitelist); 2 := FreeClaimState (whitelist). |

### setOwner

```solidity
function setOwner(address newOwner) external nonpayable
```

Set the Routers owner address.

_Function Signature := 0x13af4035_

#### Parameters

| Name     | Type    | Description         |
| -------- | ------- | ------------------- |
| newOwner | address | New owners address. |

### setRecipient

```solidity
function setRecipient(address _recipient) external nonpayable
```

_Setter for public mint fee \_recipient.Function Sighash := ?_

#### Parameters

| Name        | Type    | Description |
| ----------- | ------- | ----------- |
| \_recipient | address | undefined   |

### setSigner

```solidity
function setSigner(address _token, address _signer) external nonpayable
```

Change the address used for lazy minting voucher validation.

_Event emitted by token contract. Function Sighash := 0x17f9fad1_

#### Parameters

| Name     | Type    | Description          |
| -------- | ------- | -------------------- |
| \_token  | address | 1155 token address.  |
| \_signer | address | New signers address. |

### setBaseURI

```solidity
function setBaseURI(address _token, string _uri) external nonpayable
```

Collection baseURI setter.

_Only available for Basic, Whitelist and Lazy token types. Events logged by each tokens&#39; BaseURISet functions. Function Sighash := 0x4328bd00_

#### Parameters

| Name    | Type    | Description         |
| ------- | ------- | ------------------- |
| \_token | address | 1155 token address. |
| \_uri   | string  | New URI string.     |

### setURILock

```solidity
function setURILock(address _token) external nonpayable
```

Collection baseURI locker preventing URI updates when set. Cannot be unset!

_Only available for Basic, Whitelist and Lazy token types. Events logged by each tokens&#39; setBaseURILock functions. Function Sighash := ?_

#### Parameters

| Name    | Type    | Description        |
| ------- | ------- | ------------------ |
| \_token | address | 721 token address. |

### unpause

```solidity
function unpause() external nonpayable
```

Unpaused state initializer for security risk mitigation pratice.

_Function Sighash := 0x3f4ba83a_

### whitelistSettings

```solidity
function whitelistSettings(address _token, uint256 _price, uint256 _supply, bytes32 _root) external nonpayable
```

ERC1155Whitelist whitelist config setter.

_Events event emitted by ERC1155Whitelist token implementation contracts. Function Sighash := 0xa123c38d_

#### Parameters

| Name     | Type    | Description                |
| -------- | ------- | -------------------------- |
| \_token  | address | 1155 token address.        |
| \_price  | uint256 | Whitelist price per token. |
| \_supply | uint256 | Num tokens per address.    |
| \_root   | bytes32 | Merkel root.               |

### withdraw

```solidity
function withdraw(address _token, contract ERC20 _erc20) external nonpayable
```

Withdraw both ERC20 and ONE from ERC1155 contract&#39;s balance.

_Leave `_token` param empty for withdrawing eth only. No withdraw min needs to be passed as params, since all balance from the token&#39;s contract is emptied. Function Sighash := 0xf940e385_

#### Parameters

| Name    | Type           | Description          |
| ------- | -------------- | -------------------- |
| \_token | address        | 1155 token address.  |
| \_erc20 | contract ERC20 | ERC20 token address. |

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

### OwnerUpdated

```solidity
event OwnerUpdated(address indexed user, address indexed newOwner)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| user `indexed`     | address | undefined   |
| newOwner `indexed` | address | undefined   |

### Paused

```solidity
event Paused(address account)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |

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

### Unpaused

```solidity
event Unpaused(address account)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |

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
