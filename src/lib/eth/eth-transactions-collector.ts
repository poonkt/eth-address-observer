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

import { Transaction } from "web3-core";
import { EventEmitter } from "events";
import { CollectorCache } from "../collector-cache";
import RBTree from "../../vendor/bintrees/lib/rbtree";

export class EthTransactionsCollector extends EventEmitter {
	private readonly watchList: RBTree;
	private readonly transactionsCollectorCache: CollectorCache<string>;

	constructor(watchList: RBTree, transactionsCacheSize: number) {
		super();
		this.watchList = watchList;
		this.transactionsCollectorCache = new CollectorCache(transactionsCacheSize);
	}

	async add(transactions: Transaction[]): Promise<void> {
		const foundTransactions = this.search(transactions);

		if (!foundTransactions.length) return;

		foundTransactions.forEach((transaction) => {
			this.emit("new-transaction", transaction);
		});
	}

	private search(transactions: Transaction[]): string[] {
		const foundTransactionsHash = transactions.map((transaction) => {
			let hash: string | undefined;

			this.transactionsCollectorCache.add(transaction.hash, (error) => {
				if (!error) {
					if (transaction.to && this.watchList.find(BigInt(transaction.to)) !== null) {
						hash = transaction.hash;
					}
				}
			});

			return hash;
		});

		return foundTransactionsHash.filter(Boolean);
	}
}
