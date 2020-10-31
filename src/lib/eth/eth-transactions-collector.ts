/**
 * @file eth-transactions-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import { ICollector } from "typings";
import Web3 from "web3";
import { EventEmitter } from "events";
import { TransactionsCollectorCache } from "../transactions-collector-cache";
import { RBTree } from "../../vendor/bintrees";

export class EthTransactionsCollector
	extends EventEmitter
	implements ICollector {
	private readonly web3: Web3;
	private readonly transactionsCollectorCache: TransactionsCollectorCache;
	private readonly watchList: RBTree<bigint>;

	constructor(
		web3: Web3,
		watchList: RBTree<bigint>,
		transactionsCacheSize: number
	) {
		super();
		this.web3 = web3;
		this.watchList = watchList;
		this.transactionsCollectorCache = new TransactionsCollectorCache(
			transactionsCacheSize
		);

		this.listen();
	}

	listen(): void {
		this.web3.eth
			.subscribe("pendingTransactions")
			.on("data", async (transactionHash) => {
				const foundTransaction = await this.search(transactionHash);

				if (!foundTransaction) return;

				this.transactionsCollectorCache.add(foundTransaction, (error) => {
					if (!error) {
						this.emit("new-transaction", foundTransaction);
					}
				});
			})
			.on("error", (error) => {
				console.log(error);
			});
	}

	private async search(transactionHash: string): Promise<string> | undefined {
		const transaction = await this.web3.eth.getTransaction(transactionHash);

		if (!transaction?.to) return;

		if (this.watchList.find(BigInt(transaction.to)) === null) return;
		return transactionHash;
	}
}
