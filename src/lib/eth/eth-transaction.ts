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

	async init(): Promise<void> {
		const transaction = await this.web3.eth.getTransaction(
			this.transactionHash
		);
		this.blockHash = transaction.blockHash;
		this.emit("pending", transaction);
	}

	async process(latestBlockNumber: number): Promise<void> {
		const transactionReceipt = await this.web3.eth.getTransactionReceipt(
			this.transactionHash
		);

		if (!transactionReceipt) {
			this.init();
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
