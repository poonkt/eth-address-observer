import { IEthTransactionConfig } from "typings";
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
		config: IEthTransactionConfig
	) {
		super();
		this.web3 = web3;
		this.transactionHash = transactionHash;
		this.confirmationsRequired = config.confirmationsRequired;
	}

	async process(latestBlockNumber: number): Promise<void> {
		const receipt = await this.web3.eth.getTransactionReceipt(
			this.transactionHash
		);

		if (!receipt) {
			const transaction = await this.web3.eth.getTransaction(
				this.transactionHash
			);
			this.emit("pending", transaction);

			this.blockHash = transaction.blockHash;
		} else {
			const confirmations = latestBlockNumber - receipt.blockNumber;

			if (this.blockHash !== receipt.blockHash) {
				this.emit("dropped", receipt);
			} else if (confirmations >= this.confirmationsRequired) {
				this.emit("confirmed", receipt);
			} else {
				this.emit("in-block", [receipt, confirmations]);
			}

			this.blockHash = receipt.blockHash;
		}
	}
}
