/**
 * @file eth-addresses-observer.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
import Web3 from "web3";
import { AddressesObserver, AddressesObserverConfig } from "../addresses-observer";
export interface EthAddressesObserverConfig extends Partial<AddressesObserverConfig> {
    erc20?: {
        confirmationsRequired?: number;
        cacheSize?: number;
    };
}
export declare type SubscriptionType = "pending" | "confirmation" | "success" | "transfer-pending" | "transfer-confirmation" | "transfer-success";
export declare class EthAddressesObserver extends AddressesObserver {
    private readonly web3;
    private readonly ethBlocksCollector;
    private readonly ethTransactionsCollector;
    private readonly ethTransactionsManager;
    private readonly erc20TransactionsCollector;
    private readonly erc20TransactionsManager;
    private readonly retryCollectTransactionsQueue;
    private readonly retryAddTransactionQueue;
    private readonly retryAddERC20TransferQueue;
    constructor(web3: Web3, config?: EthAddressesObserverConfig);
    subscribe(type: SubscriptionType, handler: (...args: any[]) => void): void;
    toBigInt(address: string): bigint;
    toAddress(number: bigint): string;
    private collectTransactions;
    private addTransaction;
    private addERC20Transfer;
    private processCycle;
    private retry;
}
