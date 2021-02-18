/**
 * @file transactions-manager.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
/// <reference types="node" />
import Web3 from "web3";
import { EventEmitter } from "events";
export declare class TransactionsManager extends EventEmitter {
    private readonly web3;
    private readonly confirmationsRequired;
    private transactions;
    constructor(web3: Web3, confirmationsRequired: number);
    add(transactionHash: string, payload?: unknown): Promise<void>;
    process(latestBlockNumber: number): void;
    private remove;
}
