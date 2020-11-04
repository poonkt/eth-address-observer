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
 * @file eth-transactions-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */

import { ICollector } from "typings";
import Web3 from "web3";
import { EventEmitter } from "events";
import { TransactionsCollectorCache } from "../transactions-collector-cache";
import RBTree from "../../vendor/bintrees/lib/rbtree";

export class EthTransactionsCollector
	extends EventEmitter
	implements ICollector {
	private readonly web3: Web3;
	private readonly transactionsCollectorCache: TransactionsCollectorCache;
	private readonly watchList: RBTree;

	constructor(web3: Web3, watchList: RBTree, transactionsCacheSize: number) {
		super();
		this.web3 = web3;
		this.watchList = watchList;
		this.transactionsCollectorCache = new TransactionsCollectorCache(
			transactionsCacheSize
		);

		this.listen();
	}

	listen(): void {
		this.web3.eth
			.subscribe("pendingTransactions")
			.on("data", async (transactionHash) => {
				const foundTransaction = await this.search(transactionHash);

				if (!foundTransaction) return;

				this.transactionsCollectorCache.add(foundTransaction, (error) => {
					if (!error) {
						this.emit("new-transaction", foundTransaction);
					}
				});
			})
			.on("error", (error) => {
				console.log(error);
			});
	}

	private async search(transactionHash: string): Promise<string> | undefined {
		const transaction = await this.web3.eth.getTransaction(transactionHash);

		if (!transaction?.to) return;

		if (this.watchList.find(BigInt(transaction.to)) === null) return;
		return transactionHash;
	}
}
