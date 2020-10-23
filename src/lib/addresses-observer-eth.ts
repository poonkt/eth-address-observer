import { IAddressesObserverConfig } from "typings";
import Web3 from "web3";
import { EventEmitter } from "events";
import { BlocksCollectorEth } from "./blocks-collector-eth";
import { AddressesObserver } from "./addresses-observer";
import { TransactionsCollector } from "./transactions-collector";

export class AddressesObserverEth extends AddressesObserver {
	private readonly web3: Web3;

	constructor(web3: Web3, config: IAddressesObserverConfig) {
		super(config);
		this.web3 = web3;
		new BlocksCollectorEth(this.web3, {
			cacheSize: config.blocksCacheSize,
			latestBlock: config.latestBlock
		});
		new TransactionsCollector(this.web3, this.watchList, {
			cacheSize: config.transactionsCacheSize
		});
	}

	subscribe(type: string, handler: (data: unknown) => void): EventEmitter {
		return new EventEmitter();
	}

	unsubscribe(type: string, handler: (data: unknown) => void): EventEmitter {
		return new EventEmitter();
	}
}
