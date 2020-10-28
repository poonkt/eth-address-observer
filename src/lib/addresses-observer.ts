import { EventEmitter } from "events";
import { IAddressesObserverConfig } from "typings";
import { RBTree } from "../vendor/bintrees";

export abstract class AddressesObserver extends EventEmitter {
	watchList: RBTree<bigint>;

	constructor(config: IAddressesObserverConfig) {
		if (
			config.latestBlock === undefined ||
			config.confirmationsRequired === undefined
		) {
			throw new Error("Required config fields are not specified!");
		}
		super();
		this.watchList = new RBTree((a: bigint, b: bigint) => a - b);
		config.blocksCacheSize = config.blocksCacheSize || 64;
		config.transactionsCacheSize = config.transactionsCacheSize || 32;
	}

	add(address: string | string[], cb?: (error: Error | null) => void): void {
		if (Array.isArray(address)) {
			address.forEach((item) => {
				const number = this.toBigInt(item);
				this.watchList.insert(number);
			});
		} else if (typeof address === "string")
			this.watchList.insert(this.toBigInt(address));
		else
			cb(
				new Error("TypeError: add() accepts only string or array of strings!")
			);
	}

	remove(address: string | string[], cb?: (error: Error | null) => void): void {
		if (Array.isArray(address)) {
			address.forEach((item) => {
				const number = this.toBigInt(item);
				this.watchList.remove(number);
			});
		} else if (typeof address === "string") {
			this.watchList.remove(this.toBigInt(address));
		} else
			cb(
				new Error(
					"TypeError: remove() accepts only string or array of strings!"
				)
			);
	}

	get list(): string[] {
		const arr = [];
		this.watchList.each((number: bigint) => {
			arr.push(this.toAddress(number));
		});

		return arr;
	}

	abstract toAddress(number: bigint): unknown;

	abstract toBigInt(address: unknown): bigint;
}
