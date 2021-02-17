/**
 * @file eth-addresses-observer.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import Web3 from "web3";
import { AddressesObserver, AddressesObserverConfig } from "../addresses-observer";
import { Erc20TransactionsCollector } from "./erc20-transactions-collector";
import { Erc20TransactionsManager } from "./erc20-transactions-manager";
import { EthBlocksCollector } from "./eth-blocks-collector";
import { EthTransactionsCollector } from "./eth-transactions-collector";
import { EthTransactionsManager } from "./eth-transactions-manager";
export interface EthAddressesObserverConfig extends Partial<AddressesObserverConfig> {
    erc20CacheSize?: number;
}
export declare type SubscriptionType = "pending" | "confirmation" | "success" | "token-transfer";
export declare class EthAddressesObserver extends AddressesObserver {
    private readonly web3;
    ethBlocksCollector: EthBlocksCollector;
    ethTransactionsCollector: EthTransactionsCollector;
    ethTransactionsManager: EthTransactionsManager;
    erc20TransactionsCollector: Erc20TransactionsCollector;
    erc20TransactionsManager: Erc20TransactionsManager;
    constructor(web3: Web3, config?: EthAddressesObserverConfig);
    subscribe<T>(type: SubscriptionType, handler: (...args: T[]) => void): void;
    toBigInt(address: string): bigint;
    toAddress(number: bigint): string;
    private process;
    private addTransaction;
}
