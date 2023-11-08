/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
} from "../../common";
import type {
  BaseContract,
  BigNumberish,
  FunctionFragment,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";

export interface MarketplaceEventsAndErrorsBaseInterface extends Interface {
  getEvent(
    nameOrSignatureOrTopic:
      | "AuctionSettingsUpdated"
      | "FactoryUpdated"
      | "FeesUpdated"
      | "PaymentTokenUpdated"
      | "RecipientUpdated"
      | "UserOutbid"
      | "WithdrawOutbid"
  ): EventFragment;
}

export namespace AuctionSettingsUpdatedEvent {
  export type InputTuple = [
    newMinDuration: BigNumberish,
    newIncrement: BigNumberish,
    newMinBidValue: BigNumberish,
    newMaxDuration: BigNumberish
  ];
  export type OutputTuple = [
    newMinDuration: bigint,
    newIncrement: bigint,
    newMinBidValue: bigint,
    newMaxDuration: bigint
  ];
  export interface OutputObject {
    newMinDuration: bigint;
    newIncrement: bigint;
    newMinBidValue: bigint;
    newMaxDuration: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FactoryUpdatedEvent {
  export type InputTuple = [newFactory: AddressLike];
  export type OutputTuple = [newFactory: string];
  export interface OutputObject {
    newFactory: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FeesUpdatedEvent {
  export type InputTuple = [feeVal2: BigNumberish, feeVal3: BigNumberish];
  export type OutputTuple = [feeVal2: bigint, feeVal3: bigint];
  export interface OutputObject {
    feeVal2: bigint;
    feeVal3: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PaymentTokenUpdatedEvent {
  export type InputTuple = [newPaymentToken: AddressLike];
  export type OutputTuple = [newPaymentToken: string];
  export interface OutputObject {
    newPaymentToken: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RecipientUpdatedEvent {
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

export namespace UserOutbidEvent {
  export type InputTuple = [
    user: AddressLike,
    erc20: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [user: string, erc20: string, amount: bigint];
  export interface OutputObject {
    user: string;
    erc20: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawOutbidEvent {
  export type InputTuple = [
    user: AddressLike,
    erc20: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [user: string, erc20: string, amount: bigint];
  export interface OutputObject {
    user: string;
    erc20: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface MarketplaceEventsAndErrorsBase extends BaseContract {
  connect(runner?: ContractRunner | null): MarketplaceEventsAndErrorsBase;
  waitForDeployment(): Promise<this>;

  interface: MarketplaceEventsAndErrorsBaseInterface;

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

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getEvent(
    key: "AuctionSettingsUpdated"
  ): TypedContractEvent<
    AuctionSettingsUpdatedEvent.InputTuple,
    AuctionSettingsUpdatedEvent.OutputTuple,
    AuctionSettingsUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "FactoryUpdated"
  ): TypedContractEvent<
    FactoryUpdatedEvent.InputTuple,
    FactoryUpdatedEvent.OutputTuple,
    FactoryUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "FeesUpdated"
  ): TypedContractEvent<
    FeesUpdatedEvent.InputTuple,
    FeesUpdatedEvent.OutputTuple,
    FeesUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "PaymentTokenUpdated"
  ): TypedContractEvent<
    PaymentTokenUpdatedEvent.InputTuple,
    PaymentTokenUpdatedEvent.OutputTuple,
    PaymentTokenUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "RecipientUpdated"
  ): TypedContractEvent<
    RecipientUpdatedEvent.InputTuple,
    RecipientUpdatedEvent.OutputTuple,
    RecipientUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "UserOutbid"
  ): TypedContractEvent<
    UserOutbidEvent.InputTuple,
    UserOutbidEvent.OutputTuple,
    UserOutbidEvent.OutputObject
  >;
  getEvent(
    key: "WithdrawOutbid"
  ): TypedContractEvent<
    WithdrawOutbidEvent.InputTuple,
    WithdrawOutbidEvent.OutputTuple,
    WithdrawOutbidEvent.OutputObject
  >;

  filters: {
    "AuctionSettingsUpdated(uint256,uint256,uint256,uint256)": TypedContractEvent<
      AuctionSettingsUpdatedEvent.InputTuple,
      AuctionSettingsUpdatedEvent.OutputTuple,
      AuctionSettingsUpdatedEvent.OutputObject
    >;
    AuctionSettingsUpdated: TypedContractEvent<
      AuctionSettingsUpdatedEvent.InputTuple,
      AuctionSettingsUpdatedEvent.OutputTuple,
      AuctionSettingsUpdatedEvent.OutputObject
    >;

    "FactoryUpdated(address)": TypedContractEvent<
      FactoryUpdatedEvent.InputTuple,
      FactoryUpdatedEvent.OutputTuple,
      FactoryUpdatedEvent.OutputObject
    >;
    FactoryUpdated: TypedContractEvent<
      FactoryUpdatedEvent.InputTuple,
      FactoryUpdatedEvent.OutputTuple,
      FactoryUpdatedEvent.OutputObject
    >;

    "FeesUpdated(uint256,uint256)": TypedContractEvent<
      FeesUpdatedEvent.InputTuple,
      FeesUpdatedEvent.OutputTuple,
      FeesUpdatedEvent.OutputObject
    >;
    FeesUpdated: TypedContractEvent<
      FeesUpdatedEvent.InputTuple,
      FeesUpdatedEvent.OutputTuple,
      FeesUpdatedEvent.OutputObject
    >;

    "PaymentTokenUpdated(address)": TypedContractEvent<
      PaymentTokenUpdatedEvent.InputTuple,
      PaymentTokenUpdatedEvent.OutputTuple,
      PaymentTokenUpdatedEvent.OutputObject
    >;
    PaymentTokenUpdated: TypedContractEvent<
      PaymentTokenUpdatedEvent.InputTuple,
      PaymentTokenUpdatedEvent.OutputTuple,
      PaymentTokenUpdatedEvent.OutputObject
    >;

    "RecipientUpdated(address)": TypedContractEvent<
      RecipientUpdatedEvent.InputTuple,
      RecipientUpdatedEvent.OutputTuple,
      RecipientUpdatedEvent.OutputObject
    >;
    RecipientUpdated: TypedContractEvent<
      RecipientUpdatedEvent.InputTuple,
      RecipientUpdatedEvent.OutputTuple,
      RecipientUpdatedEvent.OutputObject
    >;

    "UserOutbid(address,address,uint256)": TypedContractEvent<
      UserOutbidEvent.InputTuple,
      UserOutbidEvent.OutputTuple,
      UserOutbidEvent.OutputObject
    >;
    UserOutbid: TypedContractEvent<
      UserOutbidEvent.InputTuple,
      UserOutbidEvent.OutputTuple,
      UserOutbidEvent.OutputObject
    >;

    "WithdrawOutbid(address,address,uint256)": TypedContractEvent<
      WithdrawOutbidEvent.InputTuple,
      WithdrawOutbidEvent.OutputTuple,
      WithdrawOutbidEvent.OutputObject
    >;
    WithdrawOutbid: TypedContractEvent<
      WithdrawOutbidEvent.InputTuple,
      WithdrawOutbidEvent.OutputTuple,
      WithdrawOutbidEvent.OutputObject
    >;
  };
}
