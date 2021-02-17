/**
 * @file erc20-transactions-manager.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
/// <reference types="node" />
import { EventEmitter } from "events";
import { Erc20Transfer } from "./erc20-transactions-collector";
export declare class Erc20TransactionsManager extends EventEmitter {
    constructor();
    add(transfer: Erc20Transfer): void;
}
