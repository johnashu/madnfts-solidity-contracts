/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  ERC721Basic,
  ERC721BasicInterface,
  FactoryTypes,
} from "../../../MADTokens/ERC721/ERC721Basic";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "_baseURI",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_maxSupply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_splitter",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "_royaltyPercentage",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "_router",
            type: "address",
          },
          {
            internalType: "address",
            name: "_erc20",
            type: "address",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
        ],
        internalType: "struct FactoryTypes.CollectionArgs",
        name: "args",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccountBalanceOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceQueryForZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "DecOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectPriceAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "LoopOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxSupplyBoundExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxSupplyReached",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthorised",
    type: "error",
  },
  {
    inputs: [],
    name: "NotMintedYet",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "NothingToWithdraw",
    type: "error",
  },
  {
    inputs: [],
    name: "PublicMintClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "RouterIsEnabled",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromIncorrectOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToNonERC721ReceiverImplementer",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "URILocked",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongArgsLength",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongPrice",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongToken",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
    ],
    name: "BaseURILocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "newBaseURI",
        type: "string",
      },
    ],
    name: "BaseURISet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "newPublicState",
        type: "bool",
      },
    ],
    name: "PublicMintStateSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRouter",
        type: "address",
      },
    ],
    name: "RouterSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newRoyaltyFee",
        type: "uint256",
      },
    ],
    name: "RoyaltyFeeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRecipient",
        type: "address",
      },
    ],
    name: "RoyaltyRecipientSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "_royaltyFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128[]",
        name: "ids",
        type: "uint128[]",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "erc20",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "erc20PaymentsEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeCountERC20",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "result",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRouter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "result",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liveSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "_liveSupply",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintCount",
    outputs: [
      {
        internalType: "uint256",
        name: "_mintCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
    ],
    name: "mintTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "result",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "publicMintState",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "routerHasAuthority",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "salePrice",
        type: "uint256",
      },
    ],
    name: "royaltyInfo",
    outputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "royaltyAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setBaseURILock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "setOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_publicMintState",
        type: "bool",
      },
    ],
    name: "setPublicMintState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_hasAuthority",
        type: "bool",
      },
    ],
    name: "setRouterHasAuthority",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "splitter",
    outputs: [
      {
        internalType: "contract SplitterImpl",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "uriLock",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_erc20",
        type: "address",
      },
    ],
    name: "withdrawERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101408060405234620001c357620028009081380380620000208162000202565b938439820191602081840312620001c35780516001600160401b0391828211620001c357019182840312620001c35762000059620001db565b928251828111620001c357816200007291850162000228565b84526020830151828111620001c357816200008f91850162000228565b60208501526040830151918211620001c357620000ae91830162000228565b60408301526060810151606083015260808101516080830152620000d560a0820162000298565b60a0830152620000e860c08201620002ad565b60c0830152620000fb60e0820162000298565b60e083015262000133610100926200011584840162000298565b848201526200012961012080940162000298565b83820152620002c2565b604051906121269283620006da843960805183818161079c0152610efd015260a0518381816111200152611f89015260c05183818161080701528181610865015281816116e501528181611d270152611dea015260e051838181610f4c01528181611d6f015261207e0152518281816115c901528181611cd50152611fb101525181818161158e0152611e510152f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b6040519061014082016001600160401b03811183821017620001fc57604052565b620001c7565b6040519190601f01601f191682016001600160401b03811183821017620001fc57604052565b919080601f84011215620001c35782516001600160401b038111620001fc576020906200025e601f8201601f1916830162000202565b92818452828287010111620001c3575f5b818110620002845750825f9394955001015290565b85810183015184820184015282016200026f565b51906001600160a01b0382168203620001c357565b51906001600160601b0382168203620001c357565b60a0810180516001600160a01b03166101008301519092906001600160a01b0316606082015160e0830151909462000340916001600160a01b031661012085810151909491906001600160a01b03169060c0870198620003386200032c8b5160018060601b031690565b6001600160601b031690565b9385620005a7565b608082016401000000008151116200040f57516200040d94602094620003d593620003c993849362000398926200032c926001600160801b031690526200038b6040890151620004b1565b516001600160601b031690565b7fc36422dcc77a5c93a5c48743078f8130c9fcc2a0ff893904ee62a3565688117c5f80a2516001600160a01b031690565b6001600160a01b031690565b7f2a5a1009e36beb67c3a1ada61dd1343d7e9ec62c70965492fbaa06234f8316b15f80a262000405815162000665565b0151620006a0565b565b604051636ad9efbd60e11b8152600490fd5b90600182811c9216801562000451575b60208310146200043d57565b634e487b7160e01b5f52602260045260245ffd5b91607f169162000431565b601f811162000469575050565b60065f5260205f20906020601f840160051c83019310620004a6575b601f0160051c01905b8181106200049a575050565b5f81556001016200048e565b909150819062000485565b80519091906001600160401b038111620001fc57620004dd81620004d760065462000421565b6200045c565b602080601f831160011462000522575081906200051193945f9262000516575b50508160011b915f199060031b1c19161790565b600655565b015190505f80620004fd565b60065f52601f198316949091907ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f925f905b8782106200058e57505083600195961062000575575b505050811b01600655565b01515f1960f88460031b161c191690555f80806200056a565b8060018596829496860151815501950193019062000554565b6080959095525f80546001600160a01b0319166001600160a01b039788161790559094939092918015620006585782156200065857849281600c1b60015580600c1b6002556001600355337fb9312e2100469bd44e3f762c248f4dcc8d7788906fabf34f79db45920c37e2695f80a37fc6b438e6a8a59579ce6a4406cbd203b740e0d47b458aae6596339bcd40c40d155f80a21660c052168060e0526200064d5760a052565b60016101005260a052565b63d92e233d5f526004601cfd5b805180601f106200069e5760209060011b910151177f897572a87d0174092695c4d573af60ba2f538ab1e5fe57428eebc5ce7dad72bb55565bfe5b805180601f106200069e5760209060011b910151177f30ec9400a6906cefbe2888cc908b6b5efeceee7bcd5438fa93fc189e1bbe64ac5556fe60806040526004361015610011575f80fd5b5f3560e01c806301ffc9a7146102af57806305e39833146102aa57806306fdde03146102a5578063081812fc146102a0578063095ea7b31461029b57806318160ddd1461020557806322ab47a11461029657806323b872dd146102915780632a55205a1461028c5780633ccfd60b146102875780633cd8045e1461028257806340475c161461027d57806342842e0e1461027857806355f804b3146102735780636352211e1461026e57806366c879a91461026957806369d3e20e146102645780636c0360eb1461025f57806370a082311461025a578063769da94314610255578063785e9e8614610250578063879fbedf1461024b578063893d20e8146102465780638c01d30814610241578063911f51f91461023c57806395d89b41146102375780639659867e14610232578063a035b1fe1461022d578063a22cb46514610228578063a701602314610223578063a7fcf7b51461021e578063b0f479a114610219578063b88d4fde14610214578063be29184f1461020f578063c87b56dd1461020a578063cb4f1c1814610205578063d139e61214610200578063d5abeb01146101fb578063d6ed2663146101f6578063e1c38ed9146101f1578063e985e9c5146101ec5763f4f3b200146101e7575f80fd5b61164f565b61160b565b6115ee565b6115b2565b611566565b61153c565b6106bf565b61140f565b6113c2565b61130b565b6112ee565b61123c565b6111c5565b611143565b611109565b6110e9565b61105a565b611038565b61101b565b610ffe565b610f7f565b610f20565b610ee6565b610e7e565b610d80565b610c7b565b610be4565b610ba8565b6109d1565b610957565b610889565b610839565b6107d0565b610769565b610755565b6106ee565b6105f6565b610532565b61049e565b6103b6565b346103b25760206003193601126103b2576004357fffffffff0000000000000000000000000000000000000000000000000000000081168091036103b257807f01ffc9a70000000000000000000000000000000000000000000000000000000060209214908115610388575b811561035e575b8115610334575b506040519015158152f35b7f2a55205a000000000000000000000000000000000000000000000000000000009150145f610329565b7f5b5e139f0000000000000000000000000000000000000000000000000000000081149150610322565b7f80ac58cd000000000000000000000000000000000000000000000000000000008114915061031b565b5f80fd5b346103b2575f6003193601126103b257602060ff600754166040519015158152f35b5f5b8381106103e95750505f910152565b81810151838201526020016103da565b60208060a052606051908160c0525f5b8281106104435750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f825f60e09485015201160190565b608081015160e08201528101610409565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f6040936020845261049781518092816020880152602088880191016103d8565b0116010190565b346103b2575f6003193601126103b2577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff007f897572a87d0174092695c4d573af60ba2f538ab1e5fe57428eebc5ce7dad72bb54607f8160011c166060521660805260a06040527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6061052d6103f9565b0160a0f35b346103b25760206003193601126103b257600435805f527f7d8825530a5a2e7a000000000000000000000000000000000000000000000000601c5260205f2081010173ffffffffffffffffffffffffffffffffffffffff80825416156105a357602091600101549060405191168152f35b63ceea21b65f526004601cfd5b6004359073ffffffffffffffffffffffffffffffffffffffff821682036103b257565b6024359073ffffffffffffffffffffffffffffffffffffffff821682036103b257565b60406003193601126103b25761060a6105b0565b6024359073ffffffffffffffffffffffffffffffffffffffff90811690825f52337f7d8825530a5a2e7a00000000000000000000000000000000000000000000000017601c5260205f2083018301908154169081156105a35782908233143315171561069b575b600101557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9255f80a4005b9050815f526030600c2054156106b2578290610671565b634b6e7f185f526004601cfd5b346103b2575f6003193601126103b25760206008546fffffffffffffffffffffffffffffffff16604051908152f35b346103b2575f6003193601126103b257602060ff60075460081c166040519015158152f35b60031960609101126103b25773ffffffffffffffffffffffffffffffffffffffff9060043582811681036103b2579160243590811681036103b2579060443590565b61076761076136610713565b91611771565b005b346103b25760406003193601126103b257604073ffffffffffffffffffffffffffffffffffffffff5f54166127106107c37f00000000000000000000000000000000000000000000000000000000000000006024356118e4565b0482519182526020820152f35b346103b2575f6003193601126103b25760025433600c1b0361082c576107674773ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016611f69565b631648fd015f526004601cfd5b346103b2575f6003193601126103b257602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b60206003193601126103b25760043567ffffffffffffffff8082116103b257366023830112156103b25781600401359081116103b25760246005923660248460051b830101116103b257600854806fffffffffffffffffffffffffffffffff16808581031190151761094a57838103908111610945576008555f5b83811061090d57005b8061093f61093a610925866001958a1b8701016118f7565b6fffffffffffffffffffffffffffffffff1690565b611a95565b01610904565b6118b7565b63ce3a3d375f526004601cfd5b61096036610713565b61096b818385611771565b813b61097357005b60405191602083019383851067ffffffffffffffff86111761099e57610767946040525f8452611b7e565b610d12565b9181601f840112156103b25782359167ffffffffffffffff83116103b257602083818601950101116103b257565b346103b2576020806003193601126103b25767ffffffffffffffff6004358181116103b257610a049036906004016109a3565b9160025433600c1b0361082c5760ff60075416610b7e57821161099e57610a3582610a30600654610cc1565b611904565b5f92601f8311600114610abd5750610a848280610a8c955f91610ab2575b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b600655611971565b7ff9c7803e94e0d3c02900d8a90893a6d5e90dd04d32a4cfe825520f82bf9f32f65f80a2005b90508301355f610a53565b60065f527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08316937ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f915f905b868210610b6657505083610a8c9510610b2e575b5050600182811b01600655611971565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88560031b161c19908301351690555f80610b1e565b80600184958294958801358155019401920190610b0a565b60046040517f31d1c0a3000000000000000000000000000000000000000000000000000000008152fd5b346103b25760206003193601126103b2576020610bc6600435611985565b73ffffffffffffffffffffffffffffffffffffffff60405191168152f35b346103b2575f6003193601126103b25760025433600c1b0361082c5760017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00600754161760075560405180610c38816119d4565b0390207f8f0a54da7ee5bbe880036935fcef1dc9f0568cbde68bcbd5e1eedd56df052ca05f80a2005b6fffffffffffffffffffffffffffffffff8116036103b257565b60206003193601126103b257600435610c9381610c61565b60ff60035416610ca8575b6107679033611c3e565b60015433600c1b14610c9e57631648fd015f526004601cfd5b90600182811c92168015610d08575b6020831014610cdb57565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b91607f1691610cd0565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761099e57604052565b346103b2575f6003193601126103b2576040515f600654610da081610cc1565b80845290602090600190818116908115610e365750600114610ddd575b610dd985610dcd81870382610d3f565b60405191829182610454565b0390f35b60065f90815293507ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f5b838510610e2357505050508101602001610dcd82610dd9610dbd565b8054868601840152938201938101610e07565b869550610dd996935060209250610dcd9491507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001682840152151560051b8201019293610dbd565b346103b25760206003193601126103b257610e976105b0565b8015610ed9577f7d8825530a5a2e7a000000000000000000000000000000000000000000000000601c525f52602063ffffffff601c600c205416604051908152f35b638f4eb6045f526004601cfd5b346103b2575f6003193601126103b25760206040517f00000000000000000000000000000000000000000000000000000000000000008152f35b346103b2575f6003193601126103b257602060405173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b6004359081151582036103b257565b346103b25760206003193601126103b257610f98610f70565b60025433600c1b0361082c576007547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff61ff0083151560081b169116176007557f2f3b349e2956d565a50532dcc875a49be7f558411642122cf5e50ca9b4bb14e65f80a2005b346103b2575f6003193601126103b257600254600c1c5f5260205ff35b346103b2575f6003193601126103b2576020600554604051908152f35b346103b2575f6003193601126103b257602060ff600354166040519015158152f35b346103b2575f6003193601126103b2577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff007f30ec9400a6906cefbe2888cc908b6b5efeceee7bcd5438fa93fc189e1bbe64ac54607f8160011c166060521660805260a06040527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6061052d6103f9565b346103b2575f6003193601126103b257602060085460801c604051908152f35b346103b2575f6003193601126103b25760206040517f00000000000000000000000000000000000000000000000000000000000000008152f35b346103b25760406003193601126103b25761115c6105b0565b602435908115158092036103b25773ffffffffffffffffffffffffffffffffffffffff9181601c52670a5a2e7a00000000600852335f52806030600c20555f5216337f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160205fa3005b346103b25760206003193601126103b2576111de6105b0565b33600c1b6001546002548032600c1b1480928414169214161461082c57801561122f5780600c1b600255337fb9312e2100469bd44e3f762c248f4dcc8d7788906fabf34f79db45920c37e2695f80a3005b63d92e233d5f526004601cfd5b60406003193601126103b2576112506105b0565b6024359061125d82610c61565b33600c1b916001926001546002548032600c1b1480928414169214161461082c576fffffffffffffffffffffffffffffffff6112d0911661129d81611e3e565b906001600854928360801c93818386019501918260801b916fffffffffffffffffffffffffffffffff1601176008550190565b91905b8281106112dc57005b806112e8859284611e8d565b016112d3565b346103b2575f6003193601126103b257600154600c1c5f5260205ff35b60806003193601126103b25761131f6105b0565b6113276105d3565b906044356064359267ffffffffffffffff938481116103b25761134e9036906004016109a3565b93909461135c848484611771565b823b61136457005b841161099e57604051936113a060207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8401160186610d3f565b80855236818701116103b2576020815f92610767988389013786010152611b7e565b60406003193601126103b2576113d66105b0565b6024356113e281610c61565b60ff600354166113f6575b61076791611c3e565b60015433600c1b146113ed57631648fd015f526004601cfd5b346103b25760206003193601126103b25760043560085460801c81116115125760405160808101604052607f810191600a8060309281810660300186530491825b6114db57610dd96114a6610dcd878760807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09283810192030181526114cf6040519485926114a0602085016119d4565b90611a7e565b7f2e6a736f6e000000000000000000000000000000000000000000000000000000815260050190565b03908101835282610d3f565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81939501948181068301865304919082611450565b60046040517fbad086ea000000000000000000000000000000000000000000000000000000008152fd5b346103b25760206003193601126103b257611555610f70565b60025433600c1b0361082c57600355005b346103b2575f6003193601126103b25760206040516fffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b346103b2575f6003193601126103b25760206040517f000000000000000000000000000000000000000000000000000000000000000015158152f35b346103b2575f6003193601126103b2576020600454604051908152f35b346103b25760406003193601126103b2576116246105b0565b61162c6105d3565b601c52670a5a2e7a000000006008525f5260206030600c20546040519015158152f35b346103b25760206003193601126103b2576116686105b0565b60025433600c1b0361082c57801561122f5773ffffffffffffffffffffffffffffffffffffffff809116604051917f70a08231000000000000000000000000000000000000000000000000000000008352306004840152602083602481855afa90811561176c575f8093604493601093602097849261173d575b507f0000000000000000000000000000000000000000000000000000000000000000166014526034526fa9059cbb00000000000000000000000082525af13d1560015f511417161561173057005b6390b8ec185f526004601cfd5b61175e919250883d8a11611765575b6117568183610d3f565b810190611f4f565b905f6116e2565b503d61174c565b611f5e565b9073ffffffffffffffffffffffffffffffffffffffff91821690821691835f52601c90337f7d8825530a5a2e7a00000000000000000000000000000000000000000000000017825260205f208501850190815480911684811481021561189c5750841561189057835f52816001018054803314863314171561187a575b611871575b5084841818905580600c207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8154019055825f5280600c2060018154019163ffffffff8316156118655750557fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef5f80a4565b6004906301336cea5f52fd5b5f90555f6117f3565b6030600c20546117ee57600485634b6e7f185f52fd5b60048363ea553b345f52fd5b83600491156118ae5763a11481005f52fd5b63ceea21b65f52fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b8181029291811591840414171561094557565b3561190181610c61565b90565b601f8111611910575050565b60065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f906020601f840160051c83019310611967575b601f0160051c01905b81811061195c575050565b5f8155600101611951565b9091508190611948565b81604051928392833781015f815203902090565b73ffffffffffffffffffffffffffffffffffffffff90805f527f7d8825530a5a2e7a000000000000000000000000000000000000000000000000601c5260205f2081010154169081156105a357565b6006545f92916119e382610cc1565b91600190818116908115611a4d57506001146119fe57505050565b909192935060065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f905f915b848310611a3a575050500190565b8181602092548587015201920191611a2c565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001683525050811515909102019150565b90611a91602092828151948592016103d8565b0190565b611a9e81611985565b50805f527f7d8825530a5a2e7a000000000000000000000000000000000000000000000000601c5260205f208101810180549073ffffffffffffffffffffffffffffffffffffffff82169081156105a357815f5280600101928354801560011715611b6c575b905f948492611b63575b50189055601c600c207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81540190557fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8280a4565b8590555f611b0e565b906030600c2054156106b25790611b04565b9060a473ffffffffffffffffffffffffffffffffffffffff9460209460405196879563150b7a0287523388880152166040860152606085015260808085015280518091818060a0880152611c2a575b505001905f601c8401915af115611c15575b517feaf485fe0000000000000000000000000000000000000000000000000000000001611c0857565b63d1a57ed65f526004601cfd5b3d611c22575f8152611bdf565b3d5f803e3d5ffd5b818760c08801920160045afa50805f611bcd565b906fffffffffffffffffffffffffffffffff16611c5a81611e3e565b60ff60075460081c1615611e1457611c728282611f85565b9081611cd3575b611cb19150906001600854928360801c93818386019501918260801b916fffffffffffffffffffffffffffffffff1601176008550190565b91905b828110611cc057505050565b80611ccd60019284611e8d565b01611cb4565b7f000000000000000000000000000000000000000000000000000000000000000015611dbb57600554828101809111610945576005556040519160605273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000166040528260601b602c526f23b872dd000000000000000000000000600c5260205f6064601c827f00000000000000000000000000000000000000000000000000000000000000005af13d1560015f5114171615611dae57611cb1915f606052604052611c79565b637939f4245f526004601cfd5b60045482810180911161094557611cb192611e0f9160045573ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016611f69565b611c79565b60046040517f2d0a3f8e000000000000000000000000000000000000000000000000000000008152fd5b6fffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169060085460801c0111611e8057565b63d05cb6095f526004601cfd5b73ffffffffffffffffffffffffffffffffffffffff168015611f4257815f527f7d8825530a5a2e7a000000000000000000000000000000000000000000000000601c5260205f208201820180548060601b611f355782179055805f52601c600c2060018154019063ffffffff821615611f2857555f7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8180a4565b6301336cea5f526004601cfd5b63c991cbb15f526004601cfd5b63ea553b345f526004601cfd5b908160209103126103b2575190565b6040513d5f823e3d90fd5b5f80809381935af115611f7857565b63b12d13eb5f526004601cfd5b91907f00000000000000000000000000000000000000000000000000000000000000009081156120e9577f00000000000000000000000000000000000000000000000000000000000000006120125750611fe1349334926118e4565b03611fe857565b60046040517f68e26200000000000000000000000000000000000000000000000000000000008152fd5b6040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff909116600482015230602482015292906020848060448101038173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165afa93841561176c575f946120c2575b50906120b9916118e4565b809210611fe857565b6120b9929194506120e19060203d602011611765576117568183610d3f565b9390916120ae565b505f92505056fea264697066735822122023012b527744fd4378c5335da4fe6bc8f41bda0698f9a918bf6a8dded736270a64736f6c63430008160033";

type ERC721BasicConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721BasicConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Basic__factory extends ContractFactory {
  constructor(...args: ERC721BasicConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    args: FactoryTypes.CollectionArgsStruct,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(args, overrides || {});
  }
  override deploy(
    args: FactoryTypes.CollectionArgsStruct,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(args, overrides || {}) as Promise<
      ERC721Basic & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERC721Basic__factory {
    return super.connect(runner) as ERC721Basic__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721BasicInterface {
    return new Interface(_abi) as ERC721BasicInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): ERC721Basic {
    return new Contract(address, _abi, runner) as unknown as ERC721Basic;
  }
}
