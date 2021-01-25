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
import { Transaction, TransactionReceipt } from "web3-core";

export class EthTransaction extends EventEmitter {
	private readonly web3: Web3;
	private readonly confirmationsRequired: number;
	private readonly transactionHash: string;

	private transaction?: Transaction;
	private transactionReceipt?: TransactionReceipt;
	private blockHash: string;

	constructor(web3: Web3, transactionHash: string, confirmationsRequired: number) {
		super();
		this.web3 = web3;
		this.confirmationsRequired = confirmationsRequired;
		this.transactionHash = transactionHash;
	}

	async init(): Promise<void> {
		this.transaction = await this.web3.eth.getTransaction(this.transactionHash);
		this.transactionReceipt = await this.web3.eth.getTransactionReceipt(this.transactionHash);
		this.blockHash = this.transaction.blockHash;

		this.emit("pending", this.transactionHash);
	}

	async process(latestBlockNumber: number): Promise<void> {
		if (!this.transactionReceipt) {
			this.transactionReceipt = await this.web3.eth.getTransactionReceipt(this.transactionHash);

			if (!this.transactionReceipt) return;
		}

		const confirmationNumber = latestBlockNumber - this.transactionReceipt.blockNumber;

		if (confirmationNumber >= this.confirmationsRequired) {
			this.transactionReceipt = await this.web3.eth.getTransactionReceipt(this.transactionHash);

			if (!this.transactionReceipt) return;

			if (this.transactionReceipt.blockHash !== this.blockHash) {
				this.blockHash = this.transactionReceipt.blockHash;
			} else {
				this.emit("success", this.transactionHash);
			}
		} else {
			this.emit("confirmation", confirmationNumber, this.transactionHash);
		}
	}
}
