import { IBlocksCollectorCacheConfig, ICollectorCache } from "typings";

export class BlocksCollectorCache implements ICollectorCache {
	private readonly cache: number[];

	constructor(config: IBlocksCollectorCacheConfig) {
		this.cache = [config.latestBlock];
		this.setup(config.cacheSize);
	}

	add(blockNumber: number): void {
		if (!this.cache.includes(blockNumber)) {
			this.cache.push(blockNumber);
		}
	}

	private setup(cacheSize: number): void {
		this.cache.push = function (blockNumber: number) {
			if (this.length >= cacheSize) {
				this.shift();
			}

			return Array.prototype.push.call(this, blockNumber);
		};
	}
}
