import { ICollector, ICollectorCacheConfig } from "typings";
import Web3 from "web3";
import { EventEmitter } from "events";
import { TransactionsCollectorCache } from "../transactions-collector-cache";

export class EthTransactionsCollector
	extends EventEmitter
	implements ICollector {
	private readonly web3: Web3;
	private readonly transactionsCollectorCache: TransactionsCollectorCache;
	private readonly watchList: string[];

	constructor(web3: Web3, watchList: string[], config: ICollectorCacheConfig) {
		super();
		this.web3 = web3;
		this.watchList = watchList;
		this.transactionsCollectorCache = new TransactionsCollectorCache(config);

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

	private async search(transactionHash: string): Promise<string> | null {
		const transaction = await this.web3.eth.getTransaction(transactionHash);
		return this.watchList.includes(transaction?.to) ? transactionHash : null;
	}
}
