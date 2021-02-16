/**
 * @file addresses-observer.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
/// <reference types="node" />
import { EventEmitter } from "events";
import RBTree from "../vendor/bintrees/lib/rbtree";
export interface AddressesObserverConfig {
    confirmationsRequired: number;
    blocksCacheSize?: number;
}
export declare abstract class AddressesObserver extends EventEmitter {
    watchList: RBTree;
    constructor(config: AddressesObserverConfig);
    add(address: string | string[]): void;
    remove(address: string | string[]): void;
    get list(): string[];
    abstract toAddress(number: bigint): unknown;
    abstract toBigInt(address: unknown): bigint;
}
