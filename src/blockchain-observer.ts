export interface IBlockchainObserverConfig {
	latestBlock: number;
	confirmationsRequired: number;
	blocksCacheSize?: number;
	transactionsCacheSize?: number;
}

export abstract class BlockchainObserver {
	watchList: string[];
	confirmationsRequired: number;
	latestBlock: number;
	blocksCacheSize: number;
	transactionsCacheSize: number;

	constructor({
		latestBlock,
		confirmationsRequired,
		blocksCacheSize,
		transactionsCacheSize
	}: IBlockchainObserverConfig) {
		if (latestBlock === undefined || confirmationsRequired === undefined) {
			throw new Error("Config required fields not specified!");
		}

		this.watchList = [];
		this.latestBlock = latestBlock;
		this.confirmationsRequired = confirmationsRequired;
		this.blocksCacheSize = blocksCacheSize || 64;
		this.transactionsCacheSize = transactionsCacheSize || 64;
	}

	abstract search(transaction: unknown): unknown | null;

	// abstract subscribe(): EventEmitter;

	add(address: string | string[], cb?: (err: string | null) => void): void {
		if (Array.isArray(address)) this.watchList.push(...address);
		else if (typeof address === "string") this.watchList.push(address);
		else cb("TypeError: add() accepts only string or array of strings!");
	}

	remove(address: string | string[], cb?: (err: string | null) => void): void {
		if (Array.isArray(address))
			this.watchList.filter((item) => !address.includes(item));
		else if (typeof address === "string")
			this.watchList.filter((item) => item !== address);
		else cb("TypeError: remove() accepts only string or array of strings!");
	}

	get list(): string[] {
		return this.watchList;
	}
}

export type TransactionState = "pending" | "in-block" | "confirmed";
