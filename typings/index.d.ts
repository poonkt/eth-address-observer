/* 
eth-address-observer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

eth-address-observer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with eth-address-observer.  If not, see <https://www.gnu.org/licenses/>.
*/
/**
 * @file index.d.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import Web3 from "web3";
import { Transaction, TransactionReceipt } from "web3-core";
import { EventEmitter } from "events";
import { RBTree } from "bintrees";

export type SubscriptionType =
	| "pending"
	| "confirmation"
	| "success"
	| "dropped";

export interface IAddressesObserverConfig {
	confirmationsRequired: number;
	blocksCacheSize?: number;
	transactionsCacheSize?: number;
}

export interface ICollectorCache {
	add(data: number | string, cb: (error: string | null) => void): void;
}

export interface IEthAddressesObserver {
	subscribe<T>(type: SubscriptionType, handler: (data: T) => void): void;
}

export type IEthAddressesObserverConfig = Partial<IAddressesObserverConfig>;

export abstract class AddressesObserver extends EventEmitter {
	watchList: RBTree<bigint | number>;
	constructor(config: IAddressesObserverConfig);
	add(address: string | string[]): void;
	remove(address: string | string[]): void;
	get list(): string[];
	abstract toAddress(number: bigint): unknown;
	abstract toBigInt(address: unknown): bigint;
}

export class BlocksCollectorCache implements ICollectorCache {
	private readonly cache;
	constructor(blocksCacheSize: number);
	add(blockNumber: number, cb: (error: string | null) => void): void;
	private setup;
}

export class TransactionsCollectorCache implements ICollectorCache {
	private readonly cache;
	constructor(transactionsCacheSize: number);
	add(transactionHash: string, cb: (error: string | null) => void): void;
	private setup;
}

export default class EthAddressesObserver
	extends AddressesObserver
	implements IEthAddressesObserver {
	ethBlocksCollector: EthBlocksCollector;
	ethTransactionsCollector: EthTransactionsCollector;
	ethTransactionsManager: EthTransactionsManager;
	constructor(web3: Web3, config?: IEthAddressesObserverConfig);
	subscribe(type: "pending", handler: (transaction: Transaction) => void): void;
	subscribe(
		type: "confirmation",
		handler: (
			confirmationNumber: number,
			transactionReceipt: TransactionReceipt
		) => void
	): void;
	subscribe(
		type: "dropped",
		handler: (transactionReceipt: TransactionReceipt) => void
	): void;
	subscribe(
		type: "success",
		handler: (transactionReceipt: TransactionReceipt) => void
	): void;
	toBigInt(address: string): bigint;
	toAddress(number: bigint): string;
}

export class EthBlocksCollector extends EventEmitter {
	private readonly web3;
	private readonly blocksCollectorCache;
	constructor(web3: Web3, blocksCacheSize: number);
	listen(): void;
}

export class EthTransaction extends EventEmitter {
	private readonly web3;
	private readonly transactionHash;
	private readonly confirmationsRequired;
	private blockHash;
	constructor(
		web3: Web3,
		transactionHash: string,
		confirmationsRequired: number
	);
	init(): Promise<void>;
	process(latestBlockNumber: number): Promise<void>;
}

export class EthTransactionsCollector extends EventEmitter {
	private readonly transactionsCollectorCache;
	private readonly watchList;
	constructor(
		watchList: RBTree<bigint | number>,
		transactionsCacheSize: number
	);
	add(transactions: Transaction[]): Promise<void>;
	private search;
}

export class EthTransactionsManager extends EventEmitter {
	private readonly web3;
	private readonly confirmationsRequired;
	private transactions;
	constructor(web3: Web3, confirmationsRequired: number);
	add(transactionHash: string): void;
	process(latestBlockNumber: number): void;
	private remove;
}
