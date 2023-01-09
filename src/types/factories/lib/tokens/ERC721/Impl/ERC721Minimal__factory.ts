/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ERC721Minimal,
  ERC721MinimalInterface,
} from "../../../../../lib/tokens/ERC721/Impl/ERC721Minimal";

const _abi = [
  {
    inputs: [
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
        name: "__tokenURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "contract SplitterImpl",
        name: "_splitter",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "_fraction",
        type: "uint96",
      },
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "contract ERC20",
        name: "_erc20",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyMinted",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidId",
    type: "error",
  },
  {
    inputs: [],
    name: "NotMinted",
    type: "error",
  },
  {
    inputs: [],
    name: "PublicMintOff",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongPrice",
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
        name: "spender",
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
        name: "approved",
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
        name: "newPublicMintState",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
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
    stateMutability: "nonpayable",
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
        name: "erc20Owner",
        type: "address",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
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
        name: "owner",
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
    inputs: [
      {
        internalType: "address",
        name: "erc20Owner",
        type: "address",
      },
    ],
    name: "publicMint",
    outputs: [],
    stateMutability: "payable",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "address",
        name: "erc20Owner",
        type: "address",
      },
    ],
    name: "safeMint",
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
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
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
    stateMutability: "nonpayable",
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
        name: "approved",
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
        name: "_uri",
        type: "string",
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
    stateMutability: "nonpayable",
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
        internalType: "contract ERC20",
        name: "_token",
        type: "address",
      },
    ],
    name: "withdrawERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260016009553480156200001657600080fd5b506040516200267f3803806200267f833981016040819052620000399162000281565b81888860006200004a8382620003f6565b506001620000598282620003f6565b5050600880546001600160a01b0319166001600160a01b0384169081179091556040519091506000907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d76908290a350600c620000b68782620003f6565b50600b859055600a80546001600160a01b038087166001600160a01b031992831681179093556001600160601b038616600681905560078054909316909317909155600d8054918416620100000262010000600160b01b03199092169190911790556040517fc36422dcc77a5c93a5c48743078f8130c9fcc2a0ff893904ee62a3565688117c90600090a26007546040516001600160a01b03909116907f2a5a1009e36beb67c3a1ada61dd1343d7e9ec62c70965492fbaa06234f8316b190600090a25050505050505050620004c2565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001af57600080fd5b81516001600160401b0380821115620001cc57620001cc62000187565b604051601f8301601f19908116603f01168101908282118183101715620001f757620001f762000187565b816040528381526020925086838588010111156200021457600080fd5b600091505b8382101562000238578582018301518183018401529082019062000219565b600093810190920192909252949350505050565b80516001600160a01b03811681146200026457600080fd5b919050565b80516001600160601b03811681146200026457600080fd5b600080600080600080600080610100898b0312156200029f57600080fd5b88516001600160401b0380821115620002b757600080fd5b620002c58c838d016200019d565b995060208b0151915080821115620002dc57600080fd5b620002ea8c838d016200019d565b985060408b01519150808211156200030157600080fd5b50620003108b828c016200019d565b965050606089015194506200032860808a016200024c565b93506200033860a08a0162000269565b92506200034860c08a016200024c565b91506200035860e08a016200024c565b90509295985092959890939650565b600181811c908216806200037c57607f821691505b6020821081036200039d57634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620003f157600081815260208120601f850160051c81016020861015620003cc5750805b601f850160051c820191505b81811015620003ed57828155600101620003d8565b5050505b505050565b81516001600160401b0381111562000412576200041262000187565b6200042a8162000423845462000367565b84620003a3565b602080601f831160018114620004625760008415620004495750858301515b600019600386901b1c1916600185901b178555620003ed565b600085815260208120601f198616915b82811015620004935788860151825594840194600190910190840162000472565b5085821015620004b25787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6121ad80620004d26000396000f3fe6080604052600436106101ac5760003560e01c80636352211e116100ec578063a035b1fe1161008a578063c87b56dd11610064578063c87b56dd146104f5578063e59aee0c14610515578063e985e9c514610528578063f4f3b2001461056357600080fd5b8063a035b1fe1461049f578063a22cb465146104b5578063b88d4fde146104d557600080fd5b8063879fbedf116100c6578063879fbedf1461043757806389afcb44146104575780638da5cb5b1461046a57806395d89b411461048a57600080fd5b80636352211e146103c357806370a08231146103e3578063785e9e861461041157600080fd5b806322ab47a11161015957806332a93a3a1161013357806332a93a3a1461035b5780633ccfd60b1461036e5780633cd8045e1461038357806342842e0e146103a357600080fd5b806322ab47a1146102dd57806323b872dd146102fc5780632a55205a1461031c57600080fd5b8063095ea7b31161018a578063095ea7b31461025657806313af403514610278578063150b7a021461029857600080fd5b806301ffc9a7146101b157806306fdde03146101e6578063081812fc14610208575b600080fd5b3480156101bd57600080fd5b506101d16101cc366004611dc9565b610583565b60405190151581526020015b60405180910390f35b3480156101f257600080fd5b506101fb6105f0565b6040516101dd9190611ded565b34801561021457600080fd5b5061023e610223366004611e3b565b6004602052600090815260409020546001600160a01b031681565b6040516001600160a01b0390911681526020016101dd565b34801561026257600080fd5b50610276610271366004611e69565b61067e565b005b34801561028457600080fd5b50610276610293366004611e95565b610765565b3480156102a457600080fd5b506102c46102b3366004611eb2565b630a85bd0160e11b95945050505050565b6040516001600160e01b031990911681526020016101dd565b3480156102e957600080fd5b50600d546101d190610100900460ff1681565b34801561030857600080fd5b50610276610317366004611f51565b6107fa565b34801561032857600080fd5b5061033c610337366004611f92565b6109e0565b604080516001600160a01b0390931683526020830191909152016101dd565b610276610369366004611e95565b610a16565b34801561037a57600080fd5b50610276610ba7565b34801561038f57600080fd5b50600a5461023e906001600160a01b031681565b3480156103af57600080fd5b506102766103be366004611f51565b610ea9565b3480156103cf57600080fd5b5061023e6103de366004611e3b565b610fa1565b3480156103ef57600080fd5b506104036103fe366004611e95565b610ff8565b6040519081526020016101dd565b34801561041d57600080fd5b50600d5461023e906201000090046001600160a01b031681565b34801561044357600080fd5b50610276610452366004611fc4565b61106c565b610276610465366004611e95565b6110fa565b34801561047657600080fd5b5060085461023e906001600160a01b031681565b34801561049657600080fd5b506101fb61115b565b3480156104ab57600080fd5b50610403600b5481565b3480156104c157600080fd5b506102766104d0366004611fdf565b611168565b3480156104e157600080fd5b506102766104f0366004611eb2565b6111d4565b34801561050157600080fd5b506101fb610510366004611e3b565b6112bc565b61027661052336600461200b565b611394565b34801561053457600080fd5b506101d161054336600461200b565b600560209081526000928352604080842090915290825290205460ff1681565b34801561056f57600080fd5b5061027661057e366004611e95565b61142b565b60006301ffc9a760e01b6001600160e01b0319831614806105b457506380ac58cd60e01b6001600160e01b03198316145b806105cf5750635b5e139f60e01b6001600160e01b03198316145b806105ea575063152a902d60e11b6001600160e01b03198316145b92915050565b600080546105fd90612044565b80601f016020809104026020016040519081016040528092919081815260200182805461062990612044565b80156106765780601f1061064b57610100808354040283529160200191610676565b820191906000526020600020905b81548152906001019060200180831161065957829003601f168201915b505050505081565b6000818152600260205260409020546001600160a01b0316338114806106c757506001600160a01b038116600090815260056020908152604080832033845290915290205460ff165b6107095760405162461bcd60e51b815260206004820152600e60248201526d1393d517d055551213d49256915160921b60448201526064015b60405180910390fd5b60008281526004602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6008546001600160a01b031633146107ae5760405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606401610700565b600880546001600160a01b0319166001600160a01b03831690811790915560405133907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a350565b6000818152600260205260409020546001600160a01b038481169116146108635760405162461bcd60e51b815260206004820152600a60248201527f57524f4e475f46524f4d000000000000000000000000000000000000000000006044820152606401610700565b6001600160a01b0382166108b95760405162461bcd60e51b815260206004820152601160248201527f494e56414c49445f524543495049454e540000000000000000000000000000006044820152606401610700565b336001600160a01b03841614806108f357506001600160a01b038316600090815260056020908152604080832033845290915290205460ff165b8061091457506000818152600460205260409020546001600160a01b031633145b6109515760405162461bcd60e51b815260206004820152600e60248201526d1393d517d055551213d49256915160921b6044820152606401610700565b6001600160a01b0380841660008181526003602090815260408083208054600019019055938616808352848320805460010190558583526002825284832080546001600160a01b03199081168317909155600490925284832080549092169091559251849392917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6007546006546001600160a01b039091169060009061271090610a03908561207e565b610a0d91906120ab565b90509250929050565b600954600114610a685760405162461bcd60e51b815260206004820152600a60248201527f5245454e5452414e4359000000000000000000000000000000000000000000006044820152606401610700565b6002600955600d546000906201000090046001600160a01b0316610a8c5734610b07565b600d54604051636eb1769f60e11b81526001600160a01b038481166004830152306024830152620100009092049091169063dd62ed3e90604401602060405180830381865afa158015610ae3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b0791906120cd565b600d54909150610100900460ff16610b325760405163287588a160e11b815260040160405180910390fd5b600b548114610b545760405163f7760f2560e01b815260040160405180910390fd5b600d5460ff1615610b7857604051631bbdf5c560e31b815260040160405180910390fd5b610b838260026117a0565b600d805460ff19166001908117909155610b9e9033906118ae565b50506001600955565b6008546001600160a01b03163314610bf05760405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606401610700565b600a546040805163e919ecad60e01b815290516000926001600160a01b03169163e919ecad9160048083019260209291908290030181865afa158015610c3a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c5e91906120cd565b905060008167ffffffffffffffff811115610c7b57610c7b6120e6565b604051908082528060200260200182016040528015610ca4578160200160208202803683370190505b50905060008267ffffffffffffffff811115610cc257610cc26120e6565b604051908082528060200260200182016040528015610ceb578160200160208202803683370190505b5090504760005b84811015610e5257600a54604051631419245f60e11b8152600481018390526000916001600160a01b03169063283248be90602401602060405180830381865afa158015610d44573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d6891906120fc565b600a5460405163b34c8caf60e01b81526001600160a01b0380841660048301529293506000929091169063b34c8caf90602401602060405180830381865afa158015610db8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ddc91906120cd565b905081868481518110610df157610df1612119565b6001600160a01b0390921660209283029190910190910152612710610e1782606461207e565b610e21908661207e565b610e2b91906120ab565b858481518110610e3d57610e3d612119565b60209081029190910101525050600101610cf2565b60005b85811015610ea157610e99858281518110610e7257610e72612119565b6020026020010151858381518110610e8c57610e8c612119565b602002602001015161199d565b600101610e55565b505050505050565b610eb48383836107fa565b6001600160a01b0382163b1580610f5d5750604051630a85bd0160e11b8082523360048301526001600160a01b03858116602484015260448301849052608060648401526000608484015290919084169063150b7a029060a4016020604051808303816000875af1158015610f2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f51919061212f565b6001600160e01b031916145b610f9c5760405162461bcd60e51b815260206004820152601060248201526f155394d0519157d49150d2541251539560821b6044820152606401610700565b505050565b6000818152600260205260409020546001600160a01b031680610ff35760405162461bcd60e51b815260206004820152600a6024820152691393d517d3525395115160b21b6044820152606401610700565b919050565b60006001600160a01b0382166110505760405162461bcd60e51b815260206004820152600c60248201527f5a45524f5f4144445245535300000000000000000000000000000000000000006044820152606401610700565b506001600160a01b031660009081526003602052604090205490565b6008546001600160a01b031633146110b55760405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606401610700565b600d805461ff001916610100831515908102919091179091556040517f2f3b349e2956d565a50532dcc875a49be7f558411642122cf5e50ca9b4bb14e690600090a250565b6008546001600160a01b031633146111435760405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606401610700565b61114e8160016117a0565b61115860016119f8565b50565b600180546105fd90612044565b3360008181526005602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6111df8585856107fa565b6001600160a01b0384163b15806112765750604051630a85bd0160e11b808252906001600160a01b0386169063150b7a02906112279033908a9089908990899060040161214c565b6020604051808303816000875af1158015611246573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061126a919061212f565b6001600160e01b031916145b6112b55760405162461bcd60e51b815260206004820152601060248201526f155394d0519157d49150d2541251539560821b6044820152606401610700565b5050505050565b6060816001146112df57604051631bf4348160e31b815260040160405180910390fd5b600d5460ff1661130257604051634d5e5fb360e01b815260040160405180910390fd5b600c805461130f90612044565b80601f016020809104026020016040519081016040528092919081815260200182805461133b90612044565b80156113885780601f1061135d57610100808354040283529160200191611388565b820191906000526020600020905b81548152906001019060200180831161136b57829003601f168201915b50505050509050919050565b6008546001600160a01b031633146113dd5760405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606401610700565b600d5460ff161561140157604051631bbdf5c560e31b815260040160405180910390fd5b61140c8160006117a0565b600d805460ff191660019081179091556114279083906118ae565b5050565b6008546001600160a01b031633146114745760405162461bcd60e51b815260206004820152600c60248201526b15539055551213d49256915160a21b6044820152606401610700565b600a546040805163e919ecad60e01b815290516000926001600160a01b03169163e919ecad9160048083019260209291908290030181865afa1580156114be573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114e291906120cd565b905060008167ffffffffffffffff8111156114ff576114ff6120e6565b604051908082528060200260200182016040528015611528578160200160208202803683370190505b50905060008267ffffffffffffffff811115611546576115466120e6565b60405190808252806020026020018201604052801561156f578160200160208202803683370190505b506040516370a0823160e01b815230600482015290915060009081906001600160a01b038716906370a0823190602401602060405180830381865afa1580156115bc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115e091906120cd565b90505b8482101561174757600a54604051631419245f60e11b8152600481018490526000916001600160a01b03169063283248be90602401602060405180830381865afa158015611635573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061165991906120fc565b600a5460405163b34c8caf60e01b81526001600160a01b0380841660048301529293506000929091169063b34c8caf90602401602060405180830381865afa1580156116a9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116cd91906120cd565b9050818685815181106116e2576116e2612119565b6001600160a01b039092166020928302919091019091015261271061170882606461207e565b611712908561207e565b61171c91906120ab565b85858151811061172e5761172e612119565b60200260200101818152505083600101935050506115e3565b60005b858110156117975761178f8786838151811061176857611768612119565b602002602001015186848151811061178257611782612119565b6020026020010151611ac5565b60010161174a565b50505050505050565b600d546000906201000090046001600160a01b03166117bf573461183a565b600d54604051636eb1769f60e11b81526001600160a01b038581166004830152306024830152620100009092049091169063dd62ed3e90604401602060405180830381865afa158015611816573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061183a91906120cd565b90508160ff1660000361185d576118586340d097c360e01b82611b51565b611879565b8160ff166001036118795761187963044df8e760e41b82611b51565b600d546201000090046001600160a01b031615610f9c57600d54610f9c906201000090046001600160a01b0316843084611c01565b6118b88282611c8d565b6001600160a01b0382163b158061195e5750604051630a85bd0160e11b80825233600483015260006024830181905260448301849052608060648401526084830152906001600160a01b0384169063150b7a029060a4016020604051808303816000875af115801561192e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611952919061212f565b6001600160e01b031916145b6114275760405162461bcd60e51b815260206004820152601060248201526f155394d0519157d49150d2541251539560821b6044820152606401610700565b600080600080600085875af1905080610f9c5760405162461bcd60e51b815260206004820152601360248201527f4554485f5452414e534645525f4641494c4544000000000000000000000000006044820152606401610700565b6000818152600260205260409020546001600160a01b031680611a4a5760405162461bcd60e51b815260206004820152600a6024820152691393d517d3525395115160b21b6044820152606401610700565b6001600160a01b038116600081815260036020908152604080832080546000190190558583526002825280832080546001600160a01b031990811690915560049092528083208054909216909155518492907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b600060405163a9059cbb60e01b8152836004820152826024820152602060006044836000895af13d15601f3d1160016000511416171691505080611b4b5760405162461bcd60e51b815260206004820152600f60248201527f5452414e534645525f4641494c454400000000000000000000000000000000006044820152606401610700565b50505050565b6008546001600160a01b0316803b63ffffffff8116600003611b735750505050565b600854604051633b7279e960e21b81526001600160e01b0319861660048201526000916001600160a01b03169063edc9e7a490602401602060405180830381865afa158015611bc6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bea91906120cd565b90508084146112b55763f7760f256000526004601cfd5b60006040516323b872dd60e01b81528460048201528360248201528260448201526020600060648360008a5af13d15601f3d11600160005114161716915050806112b55760405162461bcd60e51b815260206004820152601460248201527f5452414e534645525f46524f4d5f4641494c45440000000000000000000000006044820152606401610700565b6001600160a01b038216611ce35760405162461bcd60e51b815260206004820152601160248201527f494e56414c49445f524543495049454e540000000000000000000000000000006044820152606401610700565b6000818152600260205260409020546001600160a01b031615611d485760405162461bcd60e51b815260206004820152600e60248201527f414c52454144595f4d494e5445440000000000000000000000000000000000006044820152606401610700565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6001600160e01b03198116811461115857600080fd5b600060208284031215611ddb57600080fd5b8135611de681611db3565b9392505050565b600060208083528351808285015260005b81811015611e1a57858101830151858201604001528201611dfe565b506000604082860101526040601f19601f8301168501019250505092915050565b600060208284031215611e4d57600080fd5b5035919050565b6001600160a01b038116811461115857600080fd5b60008060408385031215611e7c57600080fd5b8235611e8781611e54565b946020939093013593505050565b600060208284031215611ea757600080fd5b8135611de681611e54565b600080600080600060808688031215611eca57600080fd5b8535611ed581611e54565b94506020860135611ee581611e54565b935060408601359250606086013567ffffffffffffffff80821115611f0957600080fd5b818801915088601f830112611f1d57600080fd5b813581811115611f2c57600080fd5b896020828501011115611f3e57600080fd5b9699959850939650602001949392505050565b600080600060608486031215611f6657600080fd5b8335611f7181611e54565b92506020840135611f8181611e54565b929592945050506040919091013590565b60008060408385031215611fa557600080fd5b50508035926020909101359150565b80358015158114610ff357600080fd5b600060208284031215611fd657600080fd5b611de682611fb4565b60008060408385031215611ff257600080fd5b8235611ffd81611e54565b9150610a0d60208401611fb4565b6000806040838503121561201e57600080fd5b823561202981611e54565b9150602083013561203981611e54565b809150509250929050565b600181811c9082168061205857607f821691505b60208210810361207857634e487b7160e01b600052602260045260246000fd5b50919050565b60008160001904831182151516156120a657634e487b7160e01b600052601160045260246000fd5b500290565b6000826120c857634e487b7160e01b600052601260045260246000fd5b500490565b6000602082840312156120df57600080fd5b5051919050565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561210e57600080fd5b8151611de681611e54565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561214157600080fd5b8151611de681611db3565b60006001600160a01b03808816835280871660208401525084604083015260806060830152826080830152828460a0840137600060a0848401015260a0601f19601f8501168301019050969550505050505056fea164736f6c6343000810000a";

type ERC721MinimalConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721MinimalConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Minimal__factory extends ContractFactory {
  constructor(...args: ERC721MinimalConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    __tokenURI: PromiseOrValue<string>,
    _price: PromiseOrValue<BigNumberish>,
    _splitter: PromiseOrValue<string>,
    _fraction: PromiseOrValue<BigNumberish>,
    _router: PromiseOrValue<string>,
    _erc20: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721Minimal> {
    return super.deploy(
      _name,
      _symbol,
      __tokenURI,
      _price,
      _splitter,
      _fraction,
      _router,
      _erc20,
      overrides || {}
    ) as Promise<ERC721Minimal>;
  }
  override getDeployTransaction(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    __tokenURI: PromiseOrValue<string>,
    _price: PromiseOrValue<BigNumberish>,
    _splitter: PromiseOrValue<string>,
    _fraction: PromiseOrValue<BigNumberish>,
    _router: PromiseOrValue<string>,
    _erc20: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _name,
      _symbol,
      __tokenURI,
      _price,
      _splitter,
      _fraction,
      _router,
      _erc20,
      overrides || {}
    );
  }
  override attach(address: string): ERC721Minimal {
    return super.attach(address) as ERC721Minimal;
  }
  override connect(signer: Signer): ERC721Minimal__factory {
    return super.connect(signer) as ERC721Minimal__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721MinimalInterface {
    return new utils.Interface(_abi) as ERC721MinimalInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721Minimal {
    return new Contract(address, _abi, signerOrProvider) as ERC721Minimal;
  }
}
