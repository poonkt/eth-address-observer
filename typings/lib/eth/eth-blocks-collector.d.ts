/**
 * @file eth-blocks-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
/// <reference types="node" />
import Web3 from "web3";
import { EventEmitter } from "events";
export declare class EthBlocksCollector extends EventEmitter {
    private readonly web3;
    private readonly blocksCollectorCache;
    constructor(web3: Web3, blocksCacheSize: number);
    listen(): void;
}
