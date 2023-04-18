/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../common";
import type {
  MADRouter721,
  MADRouter721Interface,
} from "../../contracts/MADRouter721";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract FactoryVerifier",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_paymentTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "WrongPrice",
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
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
    ],
    name: "BaseURI",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "feeVal2",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeVal3",
        type: "uint256",
      },
    ],
    name: "FeesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_state",
        type: "bool",
      },
    ],
    name: "FreeClaimState",
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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newPaymentToken",
        type: "address",
      },
    ],
    name: "PaymentTokenUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_state",
        type: "bool",
      },
    ],
    name: "PublicMintState",
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
    name: "RecipientUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_payee",
        type: "address",
      },
    ],
    name: "TokenFundsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_state",
        type: "bool",
      },
    ],
    name: "WhitelistMintState",
    type: "event",
  },
  {
    inputs: [],
    name: "MADFactory721",
    outputs: [
      {
        internalType: "contract FactoryVerifier",
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
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "basicMintTo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
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
        internalType: "contract ERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeBurn",
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
        internalType: "bytes4",
        name: "sigHash",
        type: "bytes4",
      },
    ],
    name: "feeLookup",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeMint",
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
    name: "maxFeeBurn",
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
    name: "maxFeeMint",
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
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
    name: "recipient",
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
        name: "_token",
        type: "address",
      },
      {
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
    ],
    name: "setBase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "setBaseLock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feeMint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_feeBurn",
        type: "uint256",
      },
    ],
    name: "setFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_state",
        type: "bool",
      },
    ],
    name: "setMintState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "setRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "contract ERC20",
        name: "_erc20",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608034620001b557601f620016f938819003918201601f19168301916001600160401b03831184841017620001ba57808492606094604052833981010312620001b55780516001600160a01b038082169291839003620001b5576200007560406200006d60208501620001d0565b9301620001d0565b90600093818554946040519533887f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d76818aa36001600160a81b0319163360ff60a01b19161787556001805560058790556722b1c8c1227a00006006556706f05b59d3b200006007556703782dace9d90000600455600280546001600160a01b031990811690941790551690816200017f575b505081169182156200014b57506008557f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da64666040519283a26115139081620001e68239f35b62461bcd60e51b815260206004820152600f60248201526e496e76616c6964206164647265737360881b6044820152606490fd5b819060035416176003557fbd4032c1c91da2791730ea1bbc82c6b6f857da7c0a8318143d19ef74e62cd9138585a2388062000107565b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b0382168203620001b55756fe60806040526004361015610013575b600080fd5b60003560e01c806306fdde03146101cb578063089f8b1b146101c25780630b78f9c0146101b957806313af4035146101b05780633bbed4a0146101a75780633f4ba83a1461019e5780634328bd0014610195578063490f70271461018c578063583fef3414610183578063586ba7821461017a5780635c975abb1461017157806366d003ac14610168578063785e9e861461015f5780638456cb59146101565780638da5cb5b1461014d578063ba36b92d14610144578063c5cd1d3c1461013b578063c99aa4e514610132578063d44619e314610129578063e427affe14610120578063edc9e7a4146101175763f940e3851461010f57600080fd5b61000e610bde565b5061000e610b65565b5061000e610b46565b5061000e610b1c565b5061000e610afd565b5061000e610a3a565b5061000e610999565b5061000e61096f565b5061000e6108f6565b5061000e6108cc565b5061000e6108a2565b5061000e61087b565b5061000e61085c565b5061000e61083d565b5061000e610757565b5061000e6106bc565b5061000e6105c0565b5061000e61051a565b5061000e610476565b5061000e6103ae565b5061000e610270565b5061000e61022e565b600091031261000e57565b60005b8381106101f25750506000910152565b81810151838201526020016101e2565b6040916020825261022281518092816020860152602086860191016101df565b601f01601f1916010190565b503461000e57600036600319011261000e57602080526606726f7574657260465260606020f35b6001600160a01b0381160361000e57565b8015150361000e57565b503461000e57604036600319011261000e5760043561028e81610255565b60243561029a81610266565b6102a76001805414610e7e565b600260015560ff6000926102c182855460a01c1615610f93565b6102ca81611143565b9092169060018203610376576001600160a01b0316803b156103725760405163879fbedf60e01b815284151560048201529085908290602490829084905af18015610365575b61034c575b50604051921515917f0c2bd698c33cf5bea165c8a607bdd7c7d806b8b10284bfcd5b6899674b5a486d8585a461034a60018055565bf35b8061035961035f92610679565b806101d4565b38610315565b61036d610fc8565b610310565b8480fd5b60405162461bcd60e51b815260206004820152600c60248201526b494e56414c49445f5459504560a01b6044820152606490fd5b0390fd5b503461000e57604036600319011261000e576004356024356103db60018060a01b03600054163314611426565b6006548211158061046a575b15610426577f5c6323bf1c2d7aaea2c091a4751c1c87af7f2864650c336507a77d0557af37a191816040926005558160045582519182526020820152a1005b606460405162461bcd60e51b815260206004820152602060248201527f496e76616c6964206665652073657474696e67732c206265796f6e64206d61786044820152fd5b506007548111156103e7565b503461000e57602036600319011261000e5760043561049481610255565b6000546001600160a01b03906104ad9082163314611426565b811680156104e557600091825560405190337f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d768484a3f35b60405162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b21037bbb732b960991b6044820152606490fd5b503461000e57602036600319011261000e5760043561053881610255565b6000546001600160a01b03906105519082163314611426565b8116801561058957600091600855604051907f566f16f5ede69bb6f837d5da3a6cf41c863ba95621d677ff3c931aa687da64668383a2f35b60405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964206164647265737360881b6044820152606490fd5b503461000e5760008060031936011261065f5780546105e9336001600160a01b03831614611426565b60ff8160a01c161561062f5760ff60a01b191681556040513381527f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa90602090a1604051f35b60405162461bcd60e51b8152602060048201526008602482015267155394105554d15160c21b6044820152606490fd5b80fd5b50634e487b7160e01b600052604160045260246000fd5b67ffffffffffffffff811161068d57604052565b610695610662565b604052565b90601f8019910116810190811067ffffffffffffffff82111761068d57604052565b503461000e57604036600319011261000e576004356106da81610255565b6024359067ffffffffffffffff9081831161000e573660238401121561000e57826004013591821161074a575b6040519161071f601f8201601f19166020018461069a565b808352366024828601011161000e57602081600092602461074897018387013784010152610eb7565b005b610752610662565b610707565b50606036600319011261000e5760043561077081610255565b6024359061077d82610255565b61078a6001805414610e7e565b60026001556107a160ff60005460a01c1615610f93565b600160ff6107ae83611143565b90501603610376576107be611286565b6001600160a01b0316803b1561000e5760405163438b1b4b60e01b81526001600160a01b0392909216600483015260448035602484015233908301526000908290606490829034905af18015610830575b61081d575b61074860018055565b8061035961082a92610679565b38610814565b610838610fc8565b61080f565b503461000e57600036600319011261000e576020600554604051908152f35b503461000e57600036600319011261000e576020600454604051908152f35b503461000e57600036600319011261000e57602060ff60005460a01c166040519015158152f35b503461000e57600036600319011261000e576008546040516001600160a01b039091168152602090f35b503461000e57600036600319011261000e576003546040516001600160a01b039091168152602090f35b503461000e5760008060031936011261065f57805461091f336001600160a01b03831614611426565b61092f60ff8260a01c1615610f93565b60ff60a01b1916600160a01b1781556040513381527f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25890602090a1604051f35b503461000e57600036600319011261000e576000546040516001600160a01b039091168152602090f35b50604036600319011261000e576004356109b281610255565b60243567ffffffffffffffff80821161000e573660238301121561000e578160040135908111610a2d575b8060051b91604051926020926109f58483018661069a565b84526024838501918301019136831161000e57602401905b828210610a1e576107488587610ff5565b81358152908301908301610a0d565b610a35610662565b6109dd565b503461000e57602036600319011261000e57600435610a5881610255565b610a656001805414610e7e565b6002600155600090610a7e60ff835460a01c1615610f93565b600160ff610a8b83611143565b905016146000146103765781906001600160a01b0316803b15610afa5781906004604051809481936366c879a960e01b83525af18015610aed575b610ada575b50610ad560018055565b604051f35b80610359610ae792610679565b38610acb565b610af5610fc8565b610ac6565b50fd5b503461000e57600036600319011261000e576020600654604051908152f35b503461000e57600036600319011261000e576002546040516001600160a01b039091168152602090f35b503461000e57600036600319011261000e576020600754604051908152f35b503461000e57602036600319011261000e57600480356001600160e01b03198116810361000e5760009163044df8e760e41b8214916340d097c360e01b14610bd15750610bc557610bc1905b6040519081529081906020820190565b0390f35b50610bc1600554610bb1565b9050610bc1915054610bb1565b503461000e5760408060031936011261000e5760049060ff8235610c0181610255565b602435610c0d81610255565b610c1a6001805414610e7e565b6002600155610c2882611143565b9093169160018303610e45576001600160a01b039082821680151590829082610dc0575b505015610d0457600854911695906001600160a01b0316863b1561000e578551632515bef360e21b81526001600160a01b0393841692810192835292166020820152600095869183919082908490829060400103925af18015610cf7575b610ce4575b505b33917ff15624beb70c8e7a7515ad5f81ee4c24dba144c4ef1b258f8075e1a519b1a5a1858551a4610ce160018055565b51f35b80610359610cf192610679565b38610caf565b610cff610fc8565b610caa565b909150803115610d8a576008549116906001600160a01b031694813b1561000e5784516351cff8d960e01b81526001600160a01b0390961690860190815260009591869183919082908490829060200103925af18015610d7d575b610d6a575b50610cb1565b80610359610d7792610679565b38610d64565b610d85610fc8565b610d5f565b845162461bcd60e51b81526020818801818152600891810191909152674e4f5f46554e445360c01b604082015281906060010390fd5b88516370a0823160e01b81526001600160a01b03909216828b0190815291925060209183919082908190850103915afa908115610e38575b600091610e0a575b5015158138610c4c565b610e2b915060203d8111610e31575b610e23818361069a565b8101906110f3565b38610e00565b503d610e19565b610e40610fc8565b610df8565b845162461bcd60e51b8152806103aa81890160609060208152600c60208201526b494e56414c49445f5459504560a01b60408201520190565b15610e8557565b60405162461bcd60e51b815260206004820152600a6024820152695245454e5452414e435960b01b6044820152606490fd5b9060ff90610ec86001805414610e7e565b6002600155600092610ee083855460a01c1615610f93565b6001610eeb82611143565b90941603610376576001600160a01b0316803b15610f8f577f6f8750bee7bd7661be202812d7503ffaf307fb27b6d6a954a1989fdcd156bfb791610f5f918560405180926355f804b360e01b8252818381610f498860048301610202565b03925af18015610f82575b610f6f575b50610fd5565b92604051a3610f6d60018055565b565b80610359610f7c92610679565b38610f59565b610f8a610fc8565b610f54565b8380fd5b15610f9a57565b60405162461bcd60e51b815260206004820152600660248201526514105554d15160d21b6044820152606490fd5b506040513d6000823e3d90fd5b610fed906020604051928284809451938492016101df565b810103902090565b6110026001805414610e7e565b600260015561101960ff60005460a01c1615610f93565b600160ff61102683611143565b9050611030611385565b1603610376576001600160a01b0316803b1561000e5761106a91600091604051808095819463362c0cb560e01b83523390600484016110a6565b039134905af18015611099575b611086575b50610f6d60018055565b8061035961109392610679565b3861107c565b6110a1610fc8565b611077565b9092919260408201604083528151809152606083019060208093019060005b848282106110df57505050509360018060a01b0316910152565b8351855293840193909201916001016110c5565b9081602091031261000e575190565b919082604091031261000e576020825161111b81610255565b92015161112781610266565b90565b9081602091031261000e575160ff8116810361000e5790565b6002546040805163617d1d3b60e01b81526001600160a01b0393841660048201529093926020926111d69284929091168282602481845afa918215611279575b60009261125a575b50865163b64bd5eb60e01b815260048101839052919687928181602481865afa801561124d575b611221575b5051808095819463d93cb8fd60e01b8352600483019190602083019252565b03915afa918215611214575b6000926111ee57505090565b6111279250803d1061120d575b611205818361069a565b81019061112a565b503d6111fb565b61121c610fc8565b6111e2565b61124090823d8411611246575b611238818361069a565b810190611102565b506111b7565b503d61122e565b611255610fc8565b6111b2565b611272919250833d8511610e3157610e23818361069a565b903861118b565b611281610fc8565b611183565b6003546001600160a01b0316808061129c575050565b604051636eb1769f60e11b8152336004820152306024820152906020908190839060449082905afa918215611378575b600092611359575b50604051633b7279e960e21b81526340d097c360e01b6004820152818180602481015b0381305afa91821561134c575b60009261132f575b5050810361132157610f6d9130903390611461565b63f7760f256000526004601cfd5b6113459250803d10610e3157610e23818361069a565b388061130c565b611354610fc8565b611304565b816113719293503d8411610e3157610e23818361069a565b90386112d4565b611380610fc8565b6112cc565b6003546001600160a01b0316808061139b575050565b604051636eb1769f60e11b8152336004820152306024820152906020908190839060449082905afa918215611419575b6000926113fa575b50604051633b7279e960e21b815263044df8e760e41b6004820152818180602481016112f7565b816114129293503d8411610e3157610e23818361069a565b90386113d3565b611421610fc8565b6113cb565b1561142d57565b60405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606490fd5b9060006064926020958295604051946323b872dd60e01b86526004860152602485015260448401525af13d15601f3d11600160005114161716156114a157565b60405162461bcd60e51b81526020600482015260146024820152731514905394d1915497d19493d357d1905253115160621b6044820152606490fdfea26469706673582212203211bae169b0387a3720ccaae7c5f54fea4a4b3a3ed75a8ba20bc1500534cad264736f6c63430008100033";

type MADRouter721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MADRouter721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MADRouter721__factory extends ContractFactory {
  constructor(...args: MADRouter721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _factory: PromiseOrValue<string>,
    _paymentTokenAddress: PromiseOrValue<string>,
    _recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MADRouter721> {
    return super.deploy(
      _factory,
      _paymentTokenAddress,
      _recipient,
      overrides || {}
    ) as Promise<MADRouter721>;
  }
  override getDeployTransaction(
    _factory: PromiseOrValue<string>,
    _paymentTokenAddress: PromiseOrValue<string>,
    _recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _factory,
      _paymentTokenAddress,
      _recipient,
      overrides || {}
    );
  }
  override attach(address: string): MADRouter721 {
    return super.attach(address) as MADRouter721;
  }
  override connect(signer: Signer): MADRouter721__factory {
    return super.connect(signer) as MADRouter721__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MADRouter721Interface {
    return new utils.Interface(_abi) as MADRouter721Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MADRouter721 {
    return new Contract(address, _abi, signerOrProvider) as MADRouter721;
  }
}
