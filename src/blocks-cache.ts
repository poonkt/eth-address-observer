import { EventEmitter } from "events";

interface IBlocksCacheConfig {
	cacheSize: number;
	latestBlock: number;
}

export class BlocksCache {
	private readonly eventBus: EventEmitter;
	private readonly cache: number[];

	constructor(
		eventBus: EventEmitter,
		{ latestBlock, cacheSize }: IBlocksCacheConfig
	) {
		this.eventBus = eventBus;
		this.cache = [latestBlock];
		this.setup(cacheSize);
	}

	setup(cacheSize: number): void {
		this.cache.push = function (blockNumber: number) {
			if (this.length >= cacheSize) {
				this.shift();
			}

			return Array.prototype.push.call(this, blockNumber);
		};
	}

	add(blockNumber: number): void {
		if (!this.cache.includes(blockNumber)) {
			this.cache.push(blockNumber);
			this.eventBus.emit("newBlock", blockNumber);
		}
	}
}
