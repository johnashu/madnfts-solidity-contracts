/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";

export declare namespace ContractTypes {
  export type CollectionArgsStruct = {
    _name: string;
    _symbol: string;
    _baseURI: string;
    _price: BigNumberish;
    _maxSupply: BigNumberish;
    _splitter: AddressLike;
    _royaltyPercentage: BigNumberish;
    _router: AddressLike;
    _erc20: AddressLike;
    _owner: AddressLike;
  };

  export type CollectionArgsStructOutput = [
    _name: string,
    _symbol: string,
    _baseURI: string,
    _price: bigint,
    _maxSupply: bigint,
    _splitter: string,
    _royaltyPercentage: bigint,
    _router: string,
    _erc20: string,
    _owner: string
  ] & {
    _name: string;
    _symbol: string;
    _baseURI: string;
    _price: bigint;
    _maxSupply: bigint;
    _splitter: string;
    _royaltyPercentage: bigint;
    _router: string;
    _erc20: string;
    _owner: string;
  };
}

export interface ERC721BasicInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "_royaltyFee"
      | "approve"
      | "balanceOf"
      | "baseURI"
      | "burn"
      | "erc20"
      | "erc20PaymentsEnabled"
      | "feeCount"
      | "feeCountERC20"
      | "getApproved"
      | "getOwner"
      | "getRouter"
      | "isApprovedForAll"
      | "liveSupply"
      | "maxSupply"
      | "mint(uint128)"
      | "mint(address,uint128)"
      | "mintCount"
      | "mintTo"
      | "name"
      | "ownerOf"
      | "price"
      | "publicMintState"
      | "routerHasAuthority"
      | "royaltyInfo"
      | "safeTransferFrom(address,address,uint256)"
      | "safeTransferFrom(address,address,uint256,bytes)"
      | "setApprovalForAll"
      | "setBaseURI"
      | "setBaseURILock"
      | "setOwnership"
      | "setPublicMintState"
      | "setRouterHasAuthority"
      | "splitter"
      | "supportsInterface"
      | "symbol"
      | "tokenURI"
      | "totalSupply"
      | "transferFrom"
      | "uriLock"
      | "withdraw"
      | "withdrawERC20"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "ApprovalForAll"
      | "BaseURILocked"
      | "BaseURISet"
      | "OwnerUpdated"
      | "PublicMintStateSet"
      | "RouterSet"
      | "RoyaltyFeeSet"
      | "RoyaltyRecipientSet"
      | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "_royaltyFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "baseURI", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(functionFragment: "erc20", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "erc20PaymentsEnabled",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "feeCount", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "feeCountERC20",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(functionFragment: "getRouter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "liveSupply",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "maxSupply", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "mint(uint128)",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mint(address,uint128)",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "mintCount", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "mintTo",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "price", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "publicMintState",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "routerHasAuthority",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "royaltyInfo",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(functionFragment: "setBaseURI", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setBaseURILock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPublicMintState",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setRouterHasAuthority",
    values: [boolean]
  ): string;
  encodeFunctionData(functionFragment: "splitter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "uriLock", values?: undefined): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawERC20",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "_royaltyFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "baseURI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "erc20", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "erc20PaymentsEnabled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "feeCount", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "feeCountERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRouter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "liveSupply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxSupply", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "mint(uint128)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mint(address,uint128)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mintCount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mintTo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "publicMintState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "routerHasAuthority",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltyInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setBaseURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setBaseURILock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPublicMintState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRouterHasAuthority",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "splitter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "uriLock", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawERC20",
    data: BytesLike
  ): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    account: AddressLike,
    id: BigNumberish
  ];
  export type OutputTuple = [owner: string, account: string, id: bigint];
  export interface OutputObject {
    owner: string;
    account: string;
    id: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ApprovalForAllEvent {
  export type InputTuple = [
    owner: AddressLike,
    operator: AddressLike,
    isApproved: boolean
  ];
  export type OutputTuple = [
    owner: string,
    operator: string,
    isApproved: boolean
  ];
  export interface OutputObject {
    owner: string;
    operator: string;
    isApproved: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BaseURILockedEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BaseURISetEvent {
  export type InputTuple = [newBaseURI: string];
  export type OutputTuple = [newBaseURI: string];
  export interface OutputObject {
    newBaseURI: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnerUpdatedEvent {
  export type InputTuple = [user: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [user: string, newOwner: string];
  export interface OutputObject {
    user: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PublicMintStateSetEvent {
  export type InputTuple = [newPublicState: boolean];
  export type OutputTuple = [newPublicState: boolean];
  export interface OutputObject {
    newPublicState: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RouterSetEvent {
  export type InputTuple = [newRouter: AddressLike];
  export type OutputTuple = [newRouter: string];
  export interface OutputObject {
    newRouter: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoyaltyFeeSetEvent {
  export type InputTuple = [newRoyaltyFee: BigNumberish];
  export type OutputTuple = [newRoyaltyFee: bigint];
  export interface OutputObject {
    newRoyaltyFee: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoyaltyRecipientSetEvent {
  export type InputTuple = [newRecipient: AddressLike];
  export type OutputTuple = [newRecipient: string];
  export interface OutputObject {
    newRecipient: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    id: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, id: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    id: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ERC721Basic extends BaseContract {
  connect(runner?: ContractRunner | null): ERC721Basic;
  waitForDeployment(): Promise<this>;

  interface: ERC721BasicInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  _royaltyFee: TypedContractMethod<[], [bigint], "view">;

  approve: TypedContractMethod<
    [account: AddressLike, id: BigNumberish],
    [void],
    "payable"
  >;

  balanceOf: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  baseURI: TypedContractMethod<[], [string], "view">;

  burn: TypedContractMethod<[ids: BigNumberish[]], [void], "payable">;

  erc20: TypedContractMethod<[], [string], "view">;

  erc20PaymentsEnabled: TypedContractMethod<[], [boolean], "view">;

  feeCount: TypedContractMethod<[], [bigint], "view">;

  feeCountERC20: TypedContractMethod<[], [bigint], "view">;

  getApproved: TypedContractMethod<[id: BigNumberish], [string], "view">;

  getOwner: TypedContractMethod<[], [string], "view">;

  getRouter: TypedContractMethod<[], [string], "view">;

  isApprovedForAll: TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;

  liveSupply: TypedContractMethod<[], [bigint], "view">;

  maxSupply: TypedContractMethod<[], [bigint], "view">;

  "mint(uint128)": TypedContractMethod<
    [amount: BigNumberish],
    [void],
    "payable"
  >;

  "mint(address,uint128)": TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;

  mintCount: TypedContractMethod<[], [bigint], "view">;

  mintTo: TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;

  name: TypedContractMethod<[], [string], "view">;

  ownerOf: TypedContractMethod<[id: BigNumberish], [string], "view">;

  price: TypedContractMethod<[], [bigint], "view">;

  publicMintState: TypedContractMethod<[], [boolean], "view">;

  routerHasAuthority: TypedContractMethod<[], [boolean], "view">;

  royaltyInfo: TypedContractMethod<
    [arg0: BigNumberish, salePrice: BigNumberish],
    [[string, bigint] & { receiver: string; royaltyAmount: bigint }],
    "view"
  >;

  "safeTransferFrom(address,address,uint256)": TypedContractMethod<
    [from: AddressLike, to: AddressLike, id: BigNumberish],
    [void],
    "payable"
  >;

  "safeTransferFrom(address,address,uint256,bytes)": TypedContractMethod<
    [from: AddressLike, to: AddressLike, id: BigNumberish, data: BytesLike],
    [void],
    "payable"
  >;

  setApprovalForAll: TypedContractMethod<
    [operator: AddressLike, isApproved: boolean],
    [void],
    "nonpayable"
  >;

  setBaseURI: TypedContractMethod<[_baseURI: string], [void], "nonpayable">;

  setBaseURILock: TypedContractMethod<[], [void], "nonpayable">;

  setOwnership: TypedContractMethod<
    [_owner: AddressLike],
    [void],
    "nonpayable"
  >;

  setPublicMintState: TypedContractMethod<
    [_publicMintState: boolean],
    [void],
    "nonpayable"
  >;

  setRouterHasAuthority: TypedContractMethod<
    [_hasAuthority: boolean],
    [void],
    "nonpayable"
  >;

  splitter: TypedContractMethod<[], [string], "view">;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  tokenURI: TypedContractMethod<[id: BigNumberish], [string], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, id: BigNumberish],
    [void],
    "payable"
  >;

  uriLock: TypedContractMethod<[], [boolean], "view">;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  withdrawERC20: TypedContractMethod<
    [_erc20: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "_royaltyFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [account: AddressLike, id: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "baseURI"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "burn"
  ): TypedContractMethod<[ids: BigNumberish[]], [void], "payable">;
  getFunction(
    nameOrSignature: "erc20"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "erc20PaymentsEnabled"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "feeCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "feeCountERC20"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getApproved"
  ): TypedContractMethod<[id: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getOwner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getRouter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "isApprovedForAll"
  ): TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "liveSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "mint(uint128)"
  ): TypedContractMethod<[amount: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "mint(address,uint128)"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "mintCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "mintTo"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "ownerOf"
  ): TypedContractMethod<[id: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "price"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "publicMintState"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "routerHasAuthority"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "royaltyInfo"
  ): TypedContractMethod<
    [arg0: BigNumberish, salePrice: BigNumberish],
    [[string, bigint] & { receiver: string; royaltyAmount: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256)"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, id: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256,bytes)"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, id: BigNumberish, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setApprovalForAll"
  ): TypedContractMethod<
    [operator: AddressLike, isApproved: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setBaseURI"
  ): TypedContractMethod<[_baseURI: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setBaseURILock"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setOwnership"
  ): TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPublicMintState"
  ): TypedContractMethod<[_publicMintState: boolean], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setRouterHasAuthority"
  ): TypedContractMethod<[_hasAuthority: boolean], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "splitter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "tokenURI"
  ): TypedContractMethod<[id: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, id: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "uriLock"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawERC20"
  ): TypedContractMethod<[_erc20: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "ApprovalForAll"
  ): TypedContractEvent<
    ApprovalForAllEvent.InputTuple,
    ApprovalForAllEvent.OutputTuple,
    ApprovalForAllEvent.OutputObject
  >;
  getEvent(
    key: "BaseURILocked"
  ): TypedContractEvent<
    BaseURILockedEvent.InputTuple,
    BaseURILockedEvent.OutputTuple,
    BaseURILockedEvent.OutputObject
  >;
  getEvent(
    key: "BaseURISet"
  ): TypedContractEvent<
    BaseURISetEvent.InputTuple,
    BaseURISetEvent.OutputTuple,
    BaseURISetEvent.OutputObject
  >;
  getEvent(
    key: "OwnerUpdated"
  ): TypedContractEvent<
    OwnerUpdatedEvent.InputTuple,
    OwnerUpdatedEvent.OutputTuple,
    OwnerUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "PublicMintStateSet"
  ): TypedContractEvent<
    PublicMintStateSetEvent.InputTuple,
    PublicMintStateSetEvent.OutputTuple,
    PublicMintStateSetEvent.OutputObject
  >;
  getEvent(
    key: "RouterSet"
  ): TypedContractEvent<
    RouterSetEvent.InputTuple,
    RouterSetEvent.OutputTuple,
    RouterSetEvent.OutputObject
  >;
  getEvent(
    key: "RoyaltyFeeSet"
  ): TypedContractEvent<
    RoyaltyFeeSetEvent.InputTuple,
    RoyaltyFeeSetEvent.OutputTuple,
    RoyaltyFeeSetEvent.OutputObject
  >;
  getEvent(
    key: "RoyaltyRecipientSet"
  ): TypedContractEvent<
    RoyaltyRecipientSetEvent.InputTuple,
    RoyaltyRecipientSetEvent.OutputTuple,
    RoyaltyRecipientSetEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "ApprovalForAll(address,address,bool)": TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;
    ApprovalForAll: TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;

    "BaseURILocked()": TypedContractEvent<
      BaseURILockedEvent.InputTuple,
      BaseURILockedEvent.OutputTuple,
      BaseURILockedEvent.OutputObject
    >;
    BaseURILocked: TypedContractEvent<
      BaseURILockedEvent.InputTuple,
      BaseURILockedEvent.OutputTuple,
      BaseURILockedEvent.OutputObject
    >;

    "BaseURISet(string)": TypedContractEvent<
      BaseURISetEvent.InputTuple,
      BaseURISetEvent.OutputTuple,
      BaseURISetEvent.OutputObject
    >;
    BaseURISet: TypedContractEvent<
      BaseURISetEvent.InputTuple,
      BaseURISetEvent.OutputTuple,
      BaseURISetEvent.OutputObject
    >;

    "OwnerUpdated(address,address)": TypedContractEvent<
      OwnerUpdatedEvent.InputTuple,
      OwnerUpdatedEvent.OutputTuple,
      OwnerUpdatedEvent.OutputObject
    >;
    OwnerUpdated: TypedContractEvent<
      OwnerUpdatedEvent.InputTuple,
      OwnerUpdatedEvent.OutputTuple,
      OwnerUpdatedEvent.OutputObject
    >;

    "PublicMintStateSet(bool)": TypedContractEvent<
      PublicMintStateSetEvent.InputTuple,
      PublicMintStateSetEvent.OutputTuple,
      PublicMintStateSetEvent.OutputObject
    >;
    PublicMintStateSet: TypedContractEvent<
      PublicMintStateSetEvent.InputTuple,
      PublicMintStateSetEvent.OutputTuple,
      PublicMintStateSetEvent.OutputObject
    >;

    "RouterSet(address)": TypedContractEvent<
      RouterSetEvent.InputTuple,
      RouterSetEvent.OutputTuple,
      RouterSetEvent.OutputObject
    >;
    RouterSet: TypedContractEvent<
      RouterSetEvent.InputTuple,
      RouterSetEvent.OutputTuple,
      RouterSetEvent.OutputObject
    >;

    "RoyaltyFeeSet(uint256)": TypedContractEvent<
      RoyaltyFeeSetEvent.InputTuple,
      RoyaltyFeeSetEvent.OutputTuple,
      RoyaltyFeeSetEvent.OutputObject
    >;
    RoyaltyFeeSet: TypedContractEvent<
      RoyaltyFeeSetEvent.InputTuple,
      RoyaltyFeeSetEvent.OutputTuple,
      RoyaltyFeeSetEvent.OutputObject
    >;

    "RoyaltyRecipientSet(address)": TypedContractEvent<
      RoyaltyRecipientSetEvent.InputTuple,
      RoyaltyRecipientSetEvent.OutputTuple,
      RoyaltyRecipientSetEvent.OutputObject
    >;
    RoyaltyRecipientSet: TypedContractEvent<
      RoyaltyRecipientSetEvent.InputTuple,
      RoyaltyRecipientSetEvent.OutputTuple,
      RoyaltyRecipientSetEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
