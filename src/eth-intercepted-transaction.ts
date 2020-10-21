import { EventEmitter } from "events";
import Web3 from "web3";
import { TransactionState } from "./blockchain-observer";

interface EthInterceptedTransactionConfig {
	web3: Web3;
	eventBus: EventEmitter;
	confirmationsRequired: number;
}

export class EthInterceptedTransaction {
	private readonly web3: Web3;
	private readonly eventBus: EventEmitter;
	private readonly confirmationsRequired: number;
	private readonly transactionHash: string;

	private state: TransactionState;
	private blockNumber: number;
	private blockHash: string;

	constructor(
		transactionHash: string,
		{ web3, eventBus, confirmationsRequired }: EthInterceptedTransactionConfig
	) {
		this.web3 = web3;
		this.eventBus = eventBus;
		this.confirmationsRequired = confirmationsRequired;
		this.transactionHash = transactionHash;

		this.watch();
	}

	private watch() {
		this.eventBus.on("newBlock", async (latestBlockNumber) => {
			const receipt = await this.web3.eth.getTransactionReceipt(
				this.transactionHash
			);

			if (!receipt) {
				this.state = "pending";
				console.log(`transaction ${this.transactionHash} in pending state`);
			}
		});
	}
}
