/**
 * @file eth-transaction.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import { EventEmitter } from "events";
import Web3 from "web3";

export class EthTransaction extends EventEmitter {
	private readonly web3: Web3;
	private readonly transactionHash: string;
	private readonly confirmationsRequired: number;

	private blockHash: string;

	constructor(
		web3: Web3,
		transactionHash: string,
		confirmationsRequired: number
	) {
		super();
		this.web3 = web3;
		this.transactionHash = transactionHash;
		this.confirmationsRequired = confirmationsRequired;
	}

	async process(latestBlockNumber: number): Promise<void> {
		const transactionReceipt = await this.web3.eth.getTransactionReceipt(
			this.transactionHash
		);

		if (!transactionReceipt) {
			const transaction = await this.web3.eth.getTransaction(
				this.transactionHash
			);
			this.emit("pending", transaction);

			this.blockHash = transaction.blockHash;
		} else {
			const confirmationNumber =
				latestBlockNumber - transactionReceipt.blockNumber;

			if (this.blockHash !== transactionReceipt.blockHash) {
				this.emit("dropped", transactionReceipt);
			} else if (confirmationNumber >= this.confirmationsRequired) {
				this.emit("success", transactionReceipt);
			} else {
				this.emit("confirmation", confirmationNumber, transactionReceipt);
			}

			this.blockHash = transactionReceipt.blockHash;
		}
	}
}
