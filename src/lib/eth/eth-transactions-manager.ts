/**
 * @file eth-transactions-manager.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import Web3 from "web3";
import { EventEmitter } from "events";
import { EthTransaction } from "./eth-transaction";

export class EthTransactionsManager extends EventEmitter {
	private readonly web3: Web3;
	private readonly confirmationsRequired: number;
	private transactions: Map<string, EthTransaction>;

	constructor(web3: Web3, confirmationsRequired: number) {
		super();
		this.web3 = web3;
		this.confirmationsRequired = confirmationsRequired;
		this.transactions = new Map();
	}

	add(transactionHash: string): void {
		const ethTransaction = new EthTransaction(
			this.web3,
			transactionHash,
			this.confirmationsRequired
		);

		ethTransaction.on("pending", (transaction) => {
			this.emit("pending", transaction);
		});
		ethTransaction.on(
			"confirmation",
			(confirmationNumber, transactionReceipt) => {
				this.emit("confirmation", confirmationNumber, transactionReceipt);
			}
		);
		ethTransaction.on("dropped", (transactionReceipt) => {
			this.emit("dropped", transactionReceipt);
		});
		ethTransaction.once("success", (transactionReceipt) => {
			this.remove(transactionHash);
			this.emit("success", transactionReceipt);
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
