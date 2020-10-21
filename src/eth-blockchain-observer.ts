import { EventEmitter } from "events";
import {
	BlockchainObserver,
	IBlockchainObserverConfig
} from "./blockchain-observer";
import Web3 from "web3";
import { BlocksCache } from "./blocks-cache";
import { EthInterceptedTransaction } from "./eth-intercepted-transaction";
import { TransactionsCache } from "./transactions-cache";
import { IEventBus } from "./typings/event-bus";

export default class EthBlockchainObserver extends BlockchainObserver {
	private readonly web3: Web3;
	private readonly eventBus: IEventBus;
	private readonly blocksCache: BlocksCache;
	private readonly transactionsCache: TransactionsCache;

	constructor(web3: Web3, config: IBlockchainObserverConfig) {
		super(config);
		this.web3 = web3;
		this.eventBus = new EventEmitter();
		this.blocksCache = new BlocksCache(this.eventBus, {
			cacheSize: this.blocksCacheSize,
			latestBlock: this.latestBlock
		});
		this.transactionsCache = new TransactionsCache(this.eventBus, {
			cacheSize: this.transactionsCacheSize
		});

		this.start();
	}

	// subscribe(): EventEmitter {}

	async search(transactionHash: string): Promise<string> | null {
		const transaction = await this.web3.eth.getTransaction(transactionHash);
		return this.watchList.includes(transaction.to) ? transactionHash : null;
	}

	private start() {
		this.listenNewBlocks();
		this.listenNewTransactions();
	}

	private listenNewBlocks() {
		this.web3.eth
			.subscribe("newBlockHeaders")
			.on("data", ({ number }) => {
				this.blocksCache.add(number);
				console.log(this.eventBus);
			})
			.on("error", (error) => {
				console.log(error);
			});
	}

	private listenNewTransactions() {
		this.web3.eth
			.subscribe("pendingTransactions")
			.on("data", async (transactionHash) => {
				const foundTransaction = await this.search(transactionHash);
				if (!foundTransaction) return;

				this.transactionsCache.add(foundTransaction);
			})
			.on("error", (error) => {
				console.log(error);
			});

		this.eventBus.on("newTransaction", (transactionHash: string) => {
			new EthInterceptedTransaction(transactionHash, {
				web3: this.web3,
				eventBus: this.eventBus,
				confirmationsRequired: this.confirmationsRequired
			});
		});

		this.eventBus.on("duplicatedTransaction", (txHash) => {
			console.log("duplicated transaction:", txHash);
		});
	}
}

// example

const web3 = new Web3("ws://localhost:8546");
const observer = new EthBlockchainObserver(web3, {
	latestBlock: 0,
	confirmationsRequired: 12
});
observer.add(["0x2C19E600182232a5D09bFCF5dE2149b66Be4A7E7"]);
