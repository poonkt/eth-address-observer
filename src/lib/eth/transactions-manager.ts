/* 
eth-address-observer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

eth-address-observer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with eth-address-observer.  If not, see <https://www.gnu.org/licenses/>.
*/
/**
 * @file transactions-manager.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */

import Web3 from "web3";
import { EventEmitter } from "events";
import { Transaction } from "./transaction";

export class TransactionsManager extends EventEmitter {
	private readonly web3: Web3;
	private readonly confirmationsRequired: number;
	private transactions: Map<string, Transaction>;

	constructor(web3: Web3, confirmationsRequired: number) {
		super();
		this.web3 = web3;
		this.confirmationsRequired = confirmationsRequired;
		this.transactions = new Map();
	}

	async add(transactionHash: string, payload?: unknown): Promise<void> {
		let ethTransaction = new Transaction(this.web3, transactionHash, this.confirmationsRequired);

		ethTransaction.on("pending", (transactionHash: string) => {
			this.emit("pending", transactionHash, payload);
		});
		ethTransaction.on("confirmation", (confirmationNumber: number, transactionHash: string) => {
			this.emit("confirmation", confirmationNumber, transactionHash, payload);
		});
		ethTransaction.once("success", (transactionHash: string) => {
			this.remove(transactionHash);
			this.emit("success", transactionHash, payload);
		});

		try {
			await ethTransaction.init();
		} catch (error) {
			ethTransaction.removeAllListeners();
			ethTransaction = null;

			throw new Error(error.message);
		}

		this.transactions.set(transactionHash, ethTransaction);
	}

	process(latestBlockNumber: number): void {
		this.transactions.forEach((ethTransaction) => ethTransaction.process(latestBlockNumber));
	}

	private remove(transactionHash: string): void {
		this.transactions.delete(transactionHash);
	}
}
