/**
 * @file erc20-transactions-manager.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
/// <reference types="node" />
import { EventEmitter } from "events";
import { ERC20Transfer } from "./erc20-transactions-collector";
export declare class ERC20TransactionsManager extends EventEmitter {
    constructor();
    add(transfer: ERC20Transfer): void;
}
