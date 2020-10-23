export type TransactionState = "pending" | "in-block" | "confirmed";
export interface ICollector {
	listen(): void;
}
export interface ICollectorCache {
	add(data: number | string, cb: (error: string | null) => void): void;
}

export interface ICollectorCacheConfig {
	cacheSize: number;
}
export interface IBlocksCollectorCacheConfig extends ICollectorCacheConfig {
	latestBlock: number;
}

export interface IAddressesObserverConfig {
	latestBlock: number;
	confirmationsRequired: number;
	blocksCacheSize?: number;
	transactionsCacheSize?: number;
}
