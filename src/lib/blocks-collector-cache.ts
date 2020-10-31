/**
 * @file blocks-collector-cache.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import { ICollectorCache } from "typings";

export class BlocksCollectorCache implements ICollectorCache {
	private readonly cache: number[];

	constructor(blocksCacheSize: number) {
		this.cache = [];
		this.setup(blocksCacheSize);
	}

	add(blockNumber: number, cb: (error: string | null) => void): void {
		if (!this.cache.includes(blockNumber)) {
			this.cache.push(blockNumber);
			return cb(null);
		}

		return cb("Detected block duplicate, processing discarded");
	}

	private setup(cacheSize: number): void {
		this.cache.push = function (blockNumber: number) {
			console.log(blockNumber);
			if (this.length >= cacheSize) {
				this.shift();
			}

			return Array.prototype.push.call(this, blockNumber);
		};
	}
}
