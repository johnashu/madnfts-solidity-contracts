
## Analyzing contracts/MADTokens/ERC721/ERC721Basic.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/ERC721/ERC721Basic.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/ERC721' running
INFO:Detectors:
ERC721Basic.tokenURI(uint256) (contracts/MADTokens/ERC721/ERC721Basic.sol#486-496) calls abi.encodePacked() with multiple dynamic arguments:
	- string(abi.encodePacked(baseURI,Strings.toString(id),.json)) (contracts/MADTokens/ERC721/ERC721Basic.sol#495)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#abi-encodePacked-collision
INFO:Slither:contracts/MADTokens/ERC721/ERC721Basic.sol analyzed (15 contracts with 30 detectors), 1 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [encode-packed-collision](#encode-packed-collision) (1 results) (High)
## encode-packed-collision
Impact: High
Confidence: High
 - [ ] ID-0
[ERC721Basic.tokenURI(uint256)](/contracts/MADTokens/ERC721/ERC721Basic.sol#L486-L496) calls abi.encodePacked() with multiple dynamic arguments:
	- [string(abi.encodePacked(baseURI,Strings.toString(id),.json))](/contracts/MADTokens/ERC721/ERC721Basic.sol#L495)

/contracts/MADTokens/ERC721/ERC721Basic.sol#L486-L496


## Analyzing contracts/MADTokens/ERC1155/ERC1155Basic.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/ERC1155/ERC1155Basic.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/ERC1155' running
INFO:Detectors:
ERC1155Basic.uri(uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#298-313) calls abi.encodePacked() with multiple dynamic arguments:
	- string(abi.encodePacked(baseURI,Strings.toString(id),.json)) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#312)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#abi-encodePacked-collision
INFO:Detectors:
ERC1155Basic._balanceRegistrar (contracts/MADTokens/ERC1155/ERC1155Basic.sol#29) is never initialized. It is used in:
	- ERC1155Basic.liveSupply(uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#333-335)
	- ERC1155Basic.mintCount(uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#345-347)
	- ERC1155Basic._beforeTokenMint(uint256,uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#794-827)
	- ERC1155Basic._beforeTokenBatchMint(uint256[],uint256[]) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#836-904)
	- ERC1155Basic._beforeTokenBurn(uint256,uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#913-931)
	- ERC1155Basic._beforeTokenBatchBurn(uint256[],uint256[]) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#940-967)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-state-variables
INFO:Slither:contracts/MADTokens/ERC1155/ERC1155Basic.sol analyzed (15 contracts with 30 detectors), 2 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [encode-packed-collision](#encode-packed-collision) (1 results) (High)
 - [uninitialized-state](#uninitialized-state) (1 results) (High)
## encode-packed-collision
Impact: High
Confidence: High
 - [ ] ID-0
[ERC1155Basic.uri(uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L298-L313) calls abi.encodePacked() with multiple dynamic arguments:
	- [string(abi.encodePacked(baseURI,Strings.toString(id),.json))](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L312)

/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L298-L313


## uninitialized-state
Impact: High
Confidence: High
 - [ ] ID-1
[ERC1155Basic._balanceRegistrar](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L29) is never initialized. It is used in:
	- [ERC1155Basic.liveSupply(uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L333-L335)
	- [ERC1155Basic.mintCount(uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L345-L347)
	- [ERC1155Basic._beforeTokenMint(uint256,uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L794-L827)
	- [ERC1155Basic._beforeTokenBatchMint(uint256[],uint256[])](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L836-L904)
	- [ERC1155Basic._beforeTokenBurn(uint256,uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L913-L931)
	- [ERC1155Basic._beforeTokenBatchBurn(uint256[],uint256[])](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L940-L967)

/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L29


## Analyzing contracts/MADTokens/common/ImplBase.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/common/ImplBase.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/common' running
INFO:Detectors:
PaymentManager._publicPaymentHandler(uint256,address) (contracts/MADTokens/common/PaymentManager.sol#112-125) uses arbitrary from in transferFrom: SafeTransferLib.safeTransferFrom(erc20,_minter,address(splitter),_mintAmount) (contracts/MADTokens/common/PaymentManager.sol#117-119)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#arbitrary-from-in-transferfrom
INFO:Slither:contracts/MADTokens/common/ImplBase.sol analyzed (11 contracts with 30 detectors), 1 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [arbitrary-send-erc20](#arbitrary-send-erc20) (1 results) (High)
## arbitrary-send-erc20
Impact: High
Confidence: High
 - [ ] ID-0
[PaymentManager._publicPaymentHandler(uint256,address)](/contracts/MADTokens/common/PaymentManager.sol#L112-L125) uses arbitrary from in transferFrom: [SafeTransferLib.safeTransferFrom(erc20,_minter,address(splitter),_mintAmount)](/contracts/MADTokens/common/PaymentManager.sol#L117-L119)

/contracts/MADTokens/common/PaymentManager.sol#L112-L125


## Analyzing contracts/MADTokens/common/interfaces/IPublicMint.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/common/interfaces/IPublicMint.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/common/interfaces' running
INFO:Slither:contracts/MADTokens/common/interfaces/IPublicMint.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/MADTokens/common/interfaces/IERC721EventsStructsAndErrors.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/common/interfaces/IERC721EventsStructsAndErrors.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/common/interfaces' running
INFO:Slither:contracts/MADTokens/common/interfaces/IERC721EventsStructsAndErrors.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/MADTokens/common/interfaces/ImplBaseStructsEventsAndErrors.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/common/interfaces/ImplBaseStructsEventsAndErrors.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/common/interfaces' running
INFO:Slither:contracts/MADTokens/common/interfaces/ImplBaseStructsEventsAndErrors.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/MADTokens/common/interfaces/IERC1155EventsStructsAndErrors.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/common/interfaces/IERC1155EventsStructsAndErrors.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/common/interfaces' running
INFO:Slither:contracts/MADTokens/common/interfaces/IERC1155EventsStructsAndErrors.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/MADTokens/common/PaymentManager.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MADTokens/common/PaymentManager.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/MADTokens/common' running
INFO:Detectors:
PaymentManager._publicPaymentHandler(uint256,address) (contracts/MADTokens/common/PaymentManager.sol#112-125) uses arbitrary from in transferFrom: SafeTransferLib.safeTransferFrom(erc20,_minter,address(splitter),_mintAmount) (contracts/MADTokens/common/PaymentManager.sol#117-119)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#arbitrary-from-in-transferfrom
INFO:Slither:contracts/MADTokens/common/PaymentManager.sol analyzed (5 contracts with 30 detectors), 1 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [arbitrary-send-erc20](#arbitrary-send-erc20) (1 results) (High)
## arbitrary-send-erc20
Impact: High
Confidence: High
 - [ ] ID-0
[PaymentManager._publicPaymentHandler(uint256,address)](/contracts/MADTokens/common/PaymentManager.sol#L112-L125) uses arbitrary from in transferFrom: [SafeTransferLib.safeTransferFrom(erc20,_minter,address(splitter),_mintAmount)](/contracts/MADTokens/common/PaymentManager.sol#L117-L119)

/contracts/MADTokens/common/PaymentManager.sol#L112-L125


## Analyzing contracts/Splitter/SplitterEventsAndErrors.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Splitter/SplitterEventsAndErrors.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Splitter' running
INFO:Slither:contracts/Splitter/SplitterEventsAndErrors.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/Splitter/SplitterBufferLib.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Splitter/SplitterBufferLib.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Splitter' running
INFO:Slither:contracts/Splitter/SplitterBufferLib.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/Splitter/SplitterImpl.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Splitter/SplitterImpl.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Splitter' running
INFO:Slither:contracts/Splitter/SplitterImpl.sol analyzed (4 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/Factory/MADFactoryBase.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Factory/MADFactoryBase.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Factory' running
INFO:Detectors:
MADFactoryBase._collectionDeploy(uint8,bytes32,FactoryTypes.CollectionArgs) (contracts/Factory/MADFactoryBase.sol#203-217) calls abi.encodePacked() with multiple dynamic arguments:
	- deployed = CREATE3.deploy(keccak256(bytes)(abi.encode(msg.sender,_tokenSalt)),abi.encodePacked(collectionTypes[uint256(_tokenType)],abi.encode(_args)),0) (contracts/Factory/MADFactoryBase.sol#208-216)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#abi-encodePacked-collision
INFO:Slither:contracts/Factory/MADFactoryBase.sol analyzed (17 contracts with 30 detectors), 1 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [encode-packed-collision](#encode-packed-collision) (1 results) (High)
## encode-packed-collision
Impact: High
Confidence: High
 - [ ] ID-0
[MADFactoryBase._collectionDeploy(uint8,bytes32,FactoryTypes.CollectionArgs)](/contracts/Factory/MADFactoryBase.sol#L203-L217) calls abi.encodePacked() with multiple dynamic arguments:
	- [deployed = CREATE3.deploy(keccak256(bytes)(abi.encode(msg.sender,_tokenSalt)),abi.encodePacked(collectionTypes[uint256(_tokenType)],abi.encode(_args)),0)](/contracts/Factory/MADFactoryBase.sol#L208-L216)

/contracts/Factory/MADFactoryBase.sol#L203-L217


## Analyzing contracts/Factory/FeeHandler.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Factory/FeeHandler.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Factory' running
INFO:Detectors:
FeeHandlerFactory.recipient (contracts/Factory/FeeHandler.sol#17) is never initialized. It is used in:
	- FeeHandlerFactory._handleFees(uint256) (contracts/Factory/FeeHandler.sol#88-96)
	- FeeHandlerFactory._handleFees(address,function(address) returns(FeeHandlerFactory.Fee)) (contracts/Factory/FeeHandler.sol#106-124)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-state-variables
INFO:Slither:contracts/Factory/FeeHandler.sol analyzed (7 contracts with 30 detectors), 1 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [uninitialized-state](#uninitialized-state) (1 results) (High)
## uninitialized-state
Impact: High
Confidence: High
 - [ ] ID-0
[FeeHandlerFactory.recipient](/contracts/Factory/FeeHandler.sol#L17) is never initialized. It is used in:
	- [FeeHandlerFactory._handleFees(uint256)](/contracts/Factory/FeeHandler.sol#L88-L96)
	- [FeeHandlerFactory._handleFees(address,function(address) returns(FeeHandlerFactory.Fee))](/contracts/Factory/FeeHandler.sol#L106-L124)

/contracts/Factory/FeeHandler.sol#L17


## Analyzing contracts/Factory/MADFactory.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Factory/MADFactory.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Factory' running
INFO:Detectors:
MADFactoryBase._collectionDeploy(uint8,bytes32,FactoryTypes.CollectionArgs) (contracts/Factory/MADFactoryBase.sol#203-217) calls abi.encodePacked() with multiple dynamic arguments:
	- deployed = CREATE3.deploy(keccak256(bytes)(abi.encode(msg.sender,_tokenSalt)),abi.encodePacked(collectionTypes[uint256(_tokenType)],abi.encode(_args)),0) (contracts/Factory/MADFactoryBase.sol#208-216)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#abi-encodePacked-collision
INFO:Slither:contracts/Factory/MADFactory.sol analyzed (18 contracts with 30 detectors), 1 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [encode-packed-collision](#encode-packed-collision) (1 results) (High)
## encode-packed-collision
Impact: High
Confidence: High
 - [ ] ID-0
[MADFactoryBase._collectionDeploy(uint8,bytes32,FactoryTypes.CollectionArgs)](/contracts/Factory/MADFactoryBase.sol#L203-L217) calls abi.encodePacked() with multiple dynamic arguments:
	- [deployed = CREATE3.deploy(keccak256(bytes)(abi.encode(msg.sender,_tokenSalt)),abi.encodePacked(collectionTypes[uint256(_tokenType)],abi.encode(_args)),0)](/contracts/Factory/MADFactoryBase.sol#L208-L216)

/contracts/Factory/MADFactoryBase.sol#L203-L217


## Analyzing contracts/Shared/MADBase.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Shared/MADBase.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Shared' running
INFO:Slither:contracts/Shared/MADBase.sol analyzed (8 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/Shared/EventsAndErrors.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Shared/EventsAndErrors.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Shared' running
INFO:Slither:contracts/Shared/EventsAndErrors.sol analyzed (4 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/Shared/FactoryTypes.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Shared/FactoryTypes.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Shared' running
INFO:Slither:contracts/Shared/FactoryTypes.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/auth/Ownable.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/auth/Ownable.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/auth' running
INFO:Slither:contracts/lib/auth/Ownable.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/auth/FactoryVerifier.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/auth/FactoryVerifier.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/auth' running
INFO:Slither:contracts/lib/auth/FactoryVerifier.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/auth/TwoFactor.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/auth/TwoFactor.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/auth' running
INFO:Slither:contracts/lib/auth/TwoFactor.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/auth/Ownable2Step.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/auth/Ownable2Step.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/auth' running
INFO:Slither:contracts/lib/auth/Ownable2Step.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC721/Base/utils/ERC721Holder.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC721/Base/utils/ERC721Holder.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC721/Base/utils' running
INFO:Slither:contracts/lib/tokens/ERC721/Base/utils/ERC721Holder.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC721/Base/interfaces/IERC721.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC721/Base/interfaces/IERC721.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC721/Base/interfaces' running
INFO:Slither:contracts/lib/tokens/ERC721/Base/interfaces/IERC721.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC721/Base/ERC721.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC721/Base/ERC721.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC721/Base' running
INFO:Slither:contracts/lib/tokens/ERC721/Base/ERC721.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC1155/Base/ERC1155.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC1155/Base/ERC1155.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC1155/Base' running
INFO:Slither:contracts/lib/tokens/ERC1155/Base/ERC1155.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC1155/Base/utils/ERC1155Holder.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC1155/Base/utils/ERC1155Holder.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC1155/Base/utils' running
INFO:Slither:contracts/lib/tokens/ERC1155/Base/utils/ERC1155Holder.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC1155/Base/interfaces/IERC1155.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC1155/Base/interfaces/IERC1155.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC1155/Base/interfaces' running
INFO:Slither:contracts/lib/tokens/ERC1155/Base/interfaces/IERC1155.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC20/erc20-mock.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC20/erc20-mock.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC20' running
INFO:Slither:contracts/lib/tokens/ERC20/erc20-mock.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/ERC20/interfaces/IERC20.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/ERC20/interfaces/IERC20.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/ERC20/interfaces' running
INFO:Slither:contracts/lib/tokens/ERC20/interfaces/IERC20.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/tokens/common/ERC2981.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/tokens/common/ERC2981.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/tokens/common' running
INFO:Slither:contracts/lib/tokens/common/ERC2981.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/utils/SafeTransferLib.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/utils/SafeTransferLib.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/utils' running
INFO:Slither:contracts/lib/utils/SafeTransferLib.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/utils/CREATE3.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/utils/CREATE3.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/utils' running
INFO:Slither:contracts/lib/utils/CREATE3.sol analyzed (2 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/lib/utils/Strings.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/lib/utils/Strings.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/lib/utils' running
INFO:Slither:contracts/lib/utils/Strings.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/Router/MADRouter.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Router/MADRouter.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Router' running
INFO:Detectors:
ERC1155Basic.uri(uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#298-313) calls abi.encodePacked() with multiple dynamic arguments:
	- string(abi.encodePacked(baseURI,Strings.toString(id),.json)) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#312)
ERC721Basic.tokenURI(uint256) (contracts/MADTokens/ERC721/ERC721Basic.sol#486-496) calls abi.encodePacked() with multiple dynamic arguments:
	- string(abi.encodePacked(baseURI,Strings.toString(id),.json)) (contracts/MADTokens/ERC721/ERC721Basic.sol#495)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#abi-encodePacked-collision
INFO:Detectors:
ERC1155Basic._balanceRegistrar (contracts/MADTokens/ERC1155/ERC1155Basic.sol#29) is never initialized. It is used in:
	- ERC1155Basic.liveSupply(uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#333-335)
	- ERC1155Basic.mintCount(uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#345-347)
	- ERC1155Basic._beforeTokenMint(uint256,uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#794-827)
	- ERC1155Basic._beforeTokenBatchMint(uint256[],uint256[]) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#836-904)
	- ERC1155Basic._beforeTokenBurn(uint256,uint256) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#913-931)
	- ERC1155Basic._beforeTokenBatchBurn(uint256[],uint256[]) (contracts/MADTokens/ERC1155/ERC1155Basic.sol#940-967)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-state-variables
INFO:Slither:contracts/Router/MADRouter.sol analyzed (29 contracts with 30 detectors), 3 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [encode-packed-collision](#encode-packed-collision) (2 results) (High)
 - [uninitialized-state](#uninitialized-state) (1 results) (High)
## encode-packed-collision
Impact: High
Confidence: High
 - [ ] ID-0
[ERC721Basic.tokenURI(uint256)](/contracts/MADTokens/ERC721/ERC721Basic.sol#L486-L496) calls abi.encodePacked() with multiple dynamic arguments:
	- [string(abi.encodePacked(baseURI,Strings.toString(id),.json))](/contracts/MADTokens/ERC721/ERC721Basic.sol#L495)

/contracts/MADTokens/ERC721/ERC721Basic.sol#L486-L496


 - [ ] ID-1
[ERC1155Basic.uri(uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L298-L313) calls abi.encodePacked() with multiple dynamic arguments:
	- [string(abi.encodePacked(baseURI,Strings.toString(id),.json))](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L312)

/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L298-L313


## uninitialized-state
Impact: High
Confidence: High
 - [ ] ID-2
[ERC1155Basic._balanceRegistrar](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L29) is never initialized. It is used in:
	- [ERC1155Basic.liveSupply(uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L333-L335)
	- [ERC1155Basic.mintCount(uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L345-L347)
	- [ERC1155Basic._beforeTokenMint(uint256,uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L794-L827)
	- [ERC1155Basic._beforeTokenBatchMint(uint256[],uint256[])](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L836-L904)
	- [ERC1155Basic._beforeTokenBurn(uint256,uint256)](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L913-L931)
	- [ERC1155Basic._beforeTokenBatchBurn(uint256[],uint256[])](/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L940-L967)

/contracts/MADTokens/ERC1155/ERC1155Basic.sol#L29


## Analyzing contracts/Router/MADRouterBase.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Router/MADRouterBase.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Router' running
INFO:Slither:contracts/Router/MADRouterBase.sol analyzed (12 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
## Analyzing contracts/Router/FeeHandler.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/Router/FeeHandler.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts/Router' running
INFO:Detectors:
FeeHandler.recipient (contracts/Router/FeeHandler.sol#15) is never initialized. It is used in:
	- FeeHandler._handleFees(bytes4,uint256) (contracts/Router/FeeHandler.sol#112-124)
	- FeeHandler._handleFees(uint256,address,function(address) returns(FeeHandler.Fee)) (contracts/Router/FeeHandler.sol#141-158)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-state-variables
INFO:Slither:contracts/Router/FeeHandler.sol analyzed (7 contracts with 30 detectors), 1 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [uninitialized-state](#uninitialized-state) (1 results) (High)
## uninitialized-state
Impact: High
Confidence: High
 - [ ] ID-0
[FeeHandler.recipient](/contracts/Router/FeeHandler.sol#L15) is never initialized. It is used in:
	- [FeeHandler._handleFees(bytes4,uint256)](/contracts/Router/FeeHandler.sol#L112-L124)
	- [FeeHandler._handleFees(uint256,address,function(address) returns(FeeHandler.Fee))](/contracts/Router/FeeHandler.sol#L141-L158)

/contracts/Router/FeeHandler.sol#L15


## Analyzing contracts/MAD.sol
'forge config --json' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 --version' running
'/home/maffaz/.solc-select/artifacts/solc-0.8.23/solc-0.8.23 ds-test/=test/lib/forge-std/lib/ds-test/src/ forge-std/=test/lib/forge-std/ eth-gas-reporter/=node_modules/eth-gas-reporter/ hardhat/=node_modules/hardhat/ contracts/MAD.sol --combined-json abi,ast,bin,bin-runtime,srcmap,srcmap-runtime,userdoc,devdoc,hashes --optimize --optimize-runs 4294967295 --via-ir --evm-version paris --allow-paths .,/home/maffaz/GIT/MAD/madprotocol/contracts' running
INFO:Slither:contracts/MAD.sol analyzed (1 contracts with 30 detectors), 0 result(s) found
**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
