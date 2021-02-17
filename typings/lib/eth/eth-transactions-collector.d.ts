/**
 * @file eth-transactions-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
/// <reference types="node" />
import { Transaction } from "web3-core";
import { EventEmitter } from "events";
import RBTree from "../../vendor/bintrees/lib/rbtree";
export declare class EthTransactionsCollector extends EventEmitter {
    private readonly watchList;
    constructor(watchList: RBTree);
    add(transactions: Transaction[]): Promise<void>;
    private search;
}
