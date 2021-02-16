/**
 * @file eth-transaction.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
/// <reference types="node" />
import { EventEmitter } from "events";
import Web3 from "web3";
export declare class EthTransaction extends EventEmitter {
    private readonly web3;
    private readonly confirmationsRequired;
    private readonly transactionHash;
    private transaction?;
    private transactionReceipt?;
    private blockHash;
    constructor(web3: Web3, transactionHash: string, confirmationsRequired: number);
    init(): Promise<void>;
    process(latestBlockNumber: number): Promise<void>;
}
