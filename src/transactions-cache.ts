import { EventEmitter } from "events";

interface ITransactionsCacheConfig {
	cacheSize: number;
}

export class TransactionsCache {
	private eventBus: EventEmitter;
	private cache: string[];

	constructor(eventBus: EventEmitter, { cacheSize }: ITransactionsCacheConfig) {
		this.eventBus = eventBus;
		this.cache = [];
		this.setup(cacheSize);
	}

	setup(cacheSize: number): void {
		this.cache.push = function (transactionHash: string) {
			if (this.length >= cacheSize) {
				this.shift();
			}

			return Array.prototype.push.call(this, transactionHash);
		};
	}

	add(transactionHash: string): void {
		if (this.cache.includes(transactionHash)) {
			this.eventBus.emit("duplicatedTransaction", transactionHash);
		} else {
			this.cache.push(transactionHash);
			this.eventBus.emit("newTransaction", transactionHash);
		}
	}
}
