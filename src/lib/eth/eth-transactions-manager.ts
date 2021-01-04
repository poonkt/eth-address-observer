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
		ethTransaction.on("confirmation", (confirmationNumber, transaction) => {
			this.emit("confirmation", confirmationNumber, transaction);
		});
		ethTransaction.on("dropped", (transaction) => {
			this.emit("dropped", transaction);
		});
		ethTransaction.once("success", (transaction) => {
			this.remove(transactionHash);
			this.emit("success", transaction);
		});

		ethTransaction.init();

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
