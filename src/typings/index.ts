export type SubscriptionType =
	| "pending"
	| "confirmation"
	| "success"
	| "dropped";

export interface IAddressesObserverConfig {
	confirmationsRequired: number;
	blocksCacheSize?: number;
	transactionsCacheSize?: number;
}

export interface ICollector {
	listen(): void;
}
export interface ICollectorCache {
	add(data: number | string, cb: (error: string | null) => void): void;
}

export interface IEthAddressesObserver {
	subscribe<T>(type: SubscriptionType, handler: (data: T) => void): void;
}
export type IEthAddressesObserverConfig = Partial<IAddressesObserverConfig>;
