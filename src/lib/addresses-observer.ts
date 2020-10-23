import { IAddressesObserverConfig } from "typings";

export abstract class AddressesObserver {
	watchList: string[];

	constructor(config: IAddressesObserverConfig) {
		if (
			config.latestBlock === undefined ||
			config.confirmationsRequired === undefined
		) {
			throw new Error("Required config fields are not specified!");
		}
		this.watchList = [];
		config.blocksCacheSize = config.blocksCacheSize || 64;
		config.transactionsCacheSize = config.transactionsCacheSize || 32;
	}

	add(address: string | string[], cb?: (error: Error | null) => void): void {
		if (Array.isArray(address)) this.watchList.push(...address);
		else if (typeof address === "string") this.watchList.push(address);
		else
			cb(
				new Error("TypeError: add() accepts only string or array of strings!")
			);
	}

	remove(address: string | string[], cb?: (error: Error | null) => void): void {
		if (Array.isArray(address))
			this.watchList.filter((item) => !address.includes(item));
		else if (typeof address === "string")
			this.watchList.filter((item) => item !== address);
		else
			cb(
				new Error(
					"TypeError: remove() accepts only string or array of strings!"
				)
			);
	}

	get list(): string[] {
		return this.watchList;
	}
}
