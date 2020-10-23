// import { TransactionState } from "typings";
// import { EventEmitter } from "events";
// import Web3 from "web3";

// interface EthTransactionConfig {
// 	web3: Web3;
// 	eventBus: EventEmitter;
// 	confirmationsRequired: number;
// }

// export class EthTransaction {
// 	private readonly web3: Web3;
// 	private readonly confirmationsRequired: number;
// 	private readonly transactionHash: string;
// 	private readonly boundProcess: (latestBlockNumber: number) => Promise<void>;

// 	private state: TransactionState;
// 	private blockHash: string;

// 	constructor(
// 		transactionHash: string,
// 		{ web3, eventBus, confirmationsRequired }: EthTransactionConfig
// 	) {
// 		this.web3 = web3;
// 		this.eventBus = eventBus;
// 		this.confirmationsRequired = confirmationsRequired;
// 		this.transactionHash = transactionHash;

// 		this.state = "pending";

// 		this.boundProcess = this.process.bind(this);
// 		this.eventBus.on("newBlock", this.boundProcess);
// 	}

// 	private async process(latestBlockNumber: number) {
// 		const receipt = await this.web3.eth.getTransactionReceipt(
// 			this.transactionHash
// 		);

// 		if (!receipt) {
// 			this.state = "pending";
// 			return console.log(
// 				`transaction ${this.transactionHash} has pending state`
// 			);
// 		}

// 		if (this.state === "pending") {
// 			this.state = "in-block";
// 			this.blockHash = receipt.blockHash;
// 			return console.log(
// 				`transaction ${this.transactionHash} has in-block state`
// 			);
// 		}

// 		if (this.blockHash !== receipt.blockHash) {
// 			this.state = "pending";
// 			return console.log(
// 				`transaction ${this.transactionHash} has been dropped`
// 			);
// 		}

// 		if (receipt.blockNumber + this.confirmationsRequired <= latestBlockNumber) {
// 			this.state = "confirmed";
// 			this.eventBus.off("newBlock", this.boundProcess);
// 			return console.log(
// 				`transaction ${this.transactionHash} has been confirmed`
// 			);
// 		}
// 	}
// }
