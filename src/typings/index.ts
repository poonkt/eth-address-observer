import { EventEmitter } from "events";

export interface IEventBus extends EventEmitter {
	on(
		event: "duplicatedTransaction" | "newTransaction",
		listener: (transactionHash: string) => void
	): this;
	on(event: "newBlock", listener: (blockNumber: number) => void): this;
	once(
		event: "duplicatedTransaction" | "newTransaction",
		listener: (transactionHash: string) => void
	): this;
	once(event: "newBlock", listener: (blockNumber: number) => void): this;
}

export type TransactionState = "pending" | "in-block" | "confirmed";
