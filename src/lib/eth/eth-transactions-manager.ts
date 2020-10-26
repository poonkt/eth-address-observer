import { IEthTransactionConfig } from "typings";
import Web3 from "web3";
import { EventEmitter } from "events";
import { EthTransaction } from "./eth-transaction";

export class EthTransactionsManager extends EventEmitter {
	private readonly web3: Web3;
	private readonly confirmationsRequired: number;
	private transactions: Map<string, EthTransaction>;

	constructor(web3: Web3, config: IEthTransactionConfig) {
		super();
		this.web3 = web3;
		this.confirmationsRequired = config.confirmationsRequired;
		this.transactions = new Map();
	}

	add(transactionHash: string): void {
		const ethTransaction = new EthTransaction(this.web3, transactionHash, {
			confirmationsRequired: this.confirmationsRequired
		});

		ethTransaction.on("pending", (transaction) => {
			this.emit("pending", transaction);
		});
		ethTransaction.on("in-block", (transaction) => {
			this.emit("in-block", transaction);
		});
		ethTransaction.on("dropped", (transaction) => {
			this.emit("dropped", transaction);
		});
		ethTransaction.once("confirmed", (transaction) => {
			this.remove(transactionHash);
			this.emit("confirmed", transaction);
		});

		this.transactions.set(transactionHash, ethTransaction);
	}

	process(latestBlockNumber: number): void {
		this.transactions.forEach((ethTransaction) =>
			ethTransaction.process(latestBlockNumber)
		);
	}

	private remove(transactionHash: string): void {
		this.transactions.delete(transactionHash);
	}
}
