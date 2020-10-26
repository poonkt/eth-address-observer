export type SubscriptionType = "pending" | "in-block" | "confirmed" | "dropped";
export interface IEthAddressesObserver {
	subscribe<T>(type: SubscriptionType, handler: (data: T) => void): void;
}
export interface IAddressesObserverConfig {
	readonly latestBlock: number;
	readonly confirmationsRequired: number;
	blocksCacheSize?: number;
	transactionsCacheSize?: number;
}
export interface ICollector {
	listen(): void;
}
export interface ICollectorCache {
	add(data: number | string, cb: (error: string | null) => void): void;
}
export type ICollectorCacheConfig = Pick<
	IAddressesObserverConfig,
	"transactionsCacheSize"
>;
export type IBlocksCollectorCacheConfig = Pick<
	IAddressesObserverConfig,
	"latestBlock" | "blocksCacheSize"
>;
export type IEthTransactionConfig = Pick<
	IAddressesObserverConfig,
	"confirmationsRequired"
>;
