/**
 * @file addresses-observer.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import { EventEmitter } from "events";
import { IAddressesObserverConfig } from "typings";
import { RBTree } from "../vendor/bintrees";

export abstract class AddressesObserver extends EventEmitter {
	watchList: RBTree<bigint>;

	constructor(config: IAddressesObserverConfig) {
		if (config.confirmationsRequired === undefined) {
			throw new Error("Required config fields are not specified!");
		}
		super();
		this.watchList = new RBTree((a: bigint, b: bigint) => a - b);
		config.blocksCacheSize = config.blocksCacheSize || 64;
		config.transactionsCacheSize = config.transactionsCacheSize || 32;
	}

	add(address: string | string[]): void {
		if (Array.isArray(address)) {
			address.forEach((item) => this.watchList.insert(this.toBigInt(item)));
		} else if (typeof address === "string")
			this.watchList.insert(this.toBigInt(address));
	}

	remove(address: string | string[]): void {
		if (Array.isArray(address)) {
			address.forEach((item) => this.watchList.remove(this.toBigInt(item)));
		} else if (typeof address === "string")
			this.watchList.remove(this.toBigInt(address));
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
