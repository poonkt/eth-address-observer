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
 * @file erc20-transactions-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */

import Web3 from "web3";
import { Log } from "web3-core";
import { EventEmitter } from "events";
import RBTree from "../../vendor/bintrees/lib/rbtree";
import { CollectorCache } from "../collector-cache";

export interface ERC20Transfer {
	hash: string;
	address: string;
	from: string;
	to: string;
	value: string;
	log: Log;
}

export class ERC20TransactionsCollector extends EventEmitter {
	private readonly web3: Web3;
	private readonly watchList: RBTree;
	private readonly tranfersCollectorCache: CollectorCache<string>;

	constructor(web3: Web3, watchList: RBTree, tranfersCacheSize: number) {
		super();
		this.web3 = web3;
		this.watchList = watchList;
		this.tranfersCollectorCache = new CollectorCache(tranfersCacheSize);
	}

	async add(logs: Log[]): Promise<void> {
		const foundTransfers = this.search(logs);

		if (!foundTransfers.length) return;

		foundTransfers.forEach((transfer) => {
			this.emit("new-transfer", transfer);
		});
	}

	private search(logs: Log[]): ERC20Transfer[] {
		const foundTransfers = logs.map((log) => {
			const { data, topics, address, transactionHash } = log;
			let [, from, to] = topics;

			if (!from || !to) {
				return;
			}

			let transfer: ERC20Transfer | undefined;

			this.tranfersCollectorCache.add(transactionHash, (error) => {
				if (!error) {
					to = this.decode(to);

					if (this.watchList.find(BigInt(to)) !== null) {
						from = this.decode(from);
						const value = this.web3.utils.hexToNumberString(data);

						transfer = { hash: transactionHash, address, from, to, value, log };
					}
				}
			});

			return transfer;
		});

		return foundTransfers.filter(Boolean);
	}

	private decode(hex: string): string {
		return "0x" + hex.slice(-40);
	}
}
