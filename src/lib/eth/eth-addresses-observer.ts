import {
	IAddressesObserverConfig,
	IEthAddressesObserver,
	SubscriptionType
} from "typings";
import Web3 from "web3";
import { TransactionReceipt, Transaction } from "web3-core";
import { AddressesObserver } from "../addresses-observer";
import { EthBlocksCollector } from "./eth-blocks-collector";
import { EthTransactionsCollector } from "./eth-transactions-collector";
import { EthTransactionsManager } from "./eth-transactions-manager";

export class EthAddressesObserver
	extends AddressesObserver
	implements IEthAddressesObserver {
	ethBlocksCollector: EthBlocksCollector;
	ethTransactionsCollector: EthTransactionsCollector;
	ethTransactionsManager: EthTransactionsManager;

	constructor(web3: Web3, config: IAddressesObserverConfig) {
		super(config);

		this.ethBlocksCollector = new EthBlocksCollector(web3, config);
		this.ethTransactionsCollector = new EthTransactionsCollector(
			web3,
			this.watchList,
			config
		);
		this.ethTransactionsManager = new EthTransactionsManager(web3, config);

		this.ethTransactionsCollector.on("new-transaction", (transactionHash) => {
			this.ethTransactionsManager.add(transactionHash);
		});
		this.ethBlocksCollector.on("new-block", (latestBlockNumber) => {
			this.ethTransactionsManager.process(latestBlockNumber);
		});
	}

	subscribe(type: "pending", handler: (transaction: Transaction) => void): void;
	subscribe(
		type: "in-block",
		handler: (transaction: [TransactionReceipt, number]) => void
	): void;
	subscribe(
		type: "dropped",
		handler: (transaction: TransactionReceipt) => void
	): void;
	subscribe(
		type: "confirmed",
		handler: (transaction: TransactionReceipt) => void
	): void;
	subscribe<T>(type: SubscriptionType, handler: (data: T) => void): void {
		this.ethTransactionsManager.on(type, handler);
	}
}
