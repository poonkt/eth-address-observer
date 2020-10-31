/**
 * @file transactions-collector-cache.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import { ICollectorCache } from "typings";

export class TransactionsCollectorCache implements ICollectorCache {
	private readonly cache: string[];

	constructor(transactionsCacheSize: number) {
		this.cache = [];
		this.setup(transactionsCacheSize);
	}

	add(transactionHash: string, cb: (error: string | null) => void): void {
		if (!this.cache.includes(transactionHash)) {
			this.cache.push(transactionHash);
			return cb(null);
		}

		return cb("Detected transaction duplicate, processing discarded");
	}

	private setup(cacheSize: number): void {
		this.cache.push = function (transactionHash: string) {
			if (this.length >= cacheSize) {
				this.shift();
			}

			return Array.prototype.push.call(this, transactionHash);
		};
	}
}
