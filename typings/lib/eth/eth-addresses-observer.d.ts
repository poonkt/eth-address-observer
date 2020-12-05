/**
 * @file eth-addresses-observer.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import Web3 from "web3";
import { AddressesObserver, AddressesObserverConfig } from "../addresses-observer";
import { EthBlocksCollector } from "./eth-blocks-collector";
import { EthTransactionsCollector } from "./eth-transactions-collector";
import { EthTransactionsManager } from "./eth-transactions-manager";
export declare type EthAddressesObserverConfig = Partial<AddressesObserverConfig>;
export declare type SubscriptionType = "pending" | "confirmation" | "success" | "dropped";
export default class EthAddressesObserver extends AddressesObserver {
    ethBlocksCollector: EthBlocksCollector;
    ethTransactionsCollector: EthTransactionsCollector;
    ethTransactionsManager: EthTransactionsManager;
    constructor(web3: Web3, config?: EthAddressesObserverConfig);
    subscribe<T>(type: SubscriptionType, handler: (...args: T[]) => void): void;
    toBigInt(address: string): bigint;
    toAddress(number: bigint): string;
    private process;
}
