/**
 * @file erc20-transactions-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
/// <reference types="node" />
import Web3 from "web3";
import { Log } from "web3-core";
import { EventEmitter } from "events";
import RBTree from "../../vendor/bintrees/lib/rbtree";
export interface ERC20Transfer {
    hash: string;
    address: string;
    from: string;
    to: string;
    value: string;
    log: Log;
}
export declare class ERC20TransactionsCollector extends EventEmitter {
    private readonly web3;
    private readonly watchList;
    constructor(web3: Web3, watchList: RBTree);
    add(logs: Log[]): Promise<void>;
    private search;
    private decode;
}
