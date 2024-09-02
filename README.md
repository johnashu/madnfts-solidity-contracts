# MAD Smart Contracts v1.0

```ts
///     ...     ..      ..                    ..
///   x*8888x.:*8888: -"888:                dF
///  X   48888X `8888H  8888               '88bu.
/// X8x.  8888X  8888X  !888>        u     '*88888bu
/// X8888 X8888  88888   "*8%-    us888u.    ^"*8888N
/// '*888!X8888> X8888  xH8>   .@88 "8888"  beWE "888L
///   `?8 `8888  X888X X888>   9888  9888   888E  888E
///   -^  '888"  X888  8888>   9888  9888   888E  888E
///    dx '88~x. !88~  8888>   9888  9888   888E  888F
///  .8888Xf.888x:!    X888X.: 9888  9888  .888N..888
/// :""888":~"888"     `888*"  "888*""888"  `"888*""
///     "~'    "~        ""     ^Y"   ^Y'      ""     MADNFTs © 2024.
```

##

BASE Mainnet

Deployed Factory Address: 0x8BCE4F2f79f3d38B2e68766F67E01c887504aFd9
Deployed Router Address: 0xD99e2bfa45dD76325cc789F43210e262c9Ce7197
Deployed ERC20 Address:

## Sepolia BASE

Deployed Factory Address: 0xC29A0F9792c41Bfb58324aDd19Ba305f64DBBC7D
Deployed Router Address: 0x010192B4e4a521CDc46c79ed7e2138aC706297C8
Deployed ERC20 Address: 0x19E689e473EA387667149bb0C7c99c3E3201BE50

## Sepolia Ethereum

Deployed Factory Address: 0x09c8Dc3c8D85f6d128F29A91BeE718D647B78bD4
Deployed Router Address: 0x75394c88E674cde631456D653bc2f62490C504D8
Deployed ERC20 Address: 0x70D3Ee80802873D724E3a4F4cF44F99a15743d9c

## SERV TESTNET contracts

Deployed Factory Address: 0xC3963ACcD36Fc19b8b7bd4000E4439b993A5c0aB
Deployed Router Address: 0x552226C57f7D1E327cC4995015B2ea703bbcFf68
Deployed ERC20 Address: 0x7d29c9d21aE49d441E4a2F7Fb66D5445B1DCF6E7

ConduitController deployed to: 0x2f5b471293a4bDF7b56f7193b82a9f8029Dae33B
Seaport deployed to: 0x9913bCaF9B1Bd71a150D0F79c048Db8Fabe6928d

### Pre Requisites

Before installing, create a `.env` file and set criteria as in `.env.example`.

### Install

```
yarn install
```

### Compile

```
yarn compile
```

**_NOTE:_** TypeChain artifacts generated at compile time.

### Tests

```
yarn test
```

### Report Gas

```
REPORT_GAS=true yarn test
```

**_NOTE_:** Gas usage per unit test and average gas per method call.

### Test coverage

```
yarn coverage
```

**_NOTE:_** Coverage results output to ./coverage.

### Clean

Delete the smart contract artifacts and cache:

```
yarn clean
```

### Deploy

Deploy the contracts to the desired network:

```
yarn deploy:network
```

**_NOTE:_** Supported networks; Harmony Mainet, Skale Calypso, Skale Stage v3, Goerli

## Contracts Dependency Tree

**_NOTE:_** See smart contracts natspec docs in [documentation](./docs/).
