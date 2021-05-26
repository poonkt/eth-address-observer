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
    private ethBlocksCollector;
    private ethTransactionsCollector;
    private ethTransactionsManager;
    private erc20TransactionsCollector;
    private erc20TransactionsManager;
    constructor(web3: Web3, config?: EthAddressesObserverConfig);
    subscribe(type: SubscriptionType, handler: (...args: any[]) => void): void;
    toBigInt(address: string): bigint;
    toAddress(number: bigint): string;
    private process;
    private addTransaction;
    private addErc20Transfer;
}
