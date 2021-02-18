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
import { CollectorCache } from "../collector-cache";
import RBTree from "../../vendor/bintrees/lib/rbtree";

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
	private readonly erc20TransactionsCollectorCache: CollectorCache<string>;
	private readonly watchList: RBTree;

	constructor(web3: Web3, erc20CacheSize: number, watchList: RBTree) {
		super();
		this.web3 = web3;
		this.erc20TransactionsCollectorCache = new CollectorCache(erc20CacheSize);
		this.watchList = watchList;

		this.listen();
	}

	listen(): void {
		this.web3.eth
			.subscribe("logs", {
				topics: [
					"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" /** keccak packed Transfer(address,address,uint256) event interface */
				]
			})
			.on("data", (log) => {
				this.erc20TransactionsCollectorCache.add(log.transactionHash, (error) => {
					if (!error) {
						const foundTransaction = this.search(log);

						if (foundTransaction) {
							this.emit("new-transfer", foundTransaction);
						}
					}
				});
			})
			.on("error", (error) => {
				console.error(error);
			});
	}

	private search(log: Log): ERC20Transfer | null {
		const { data, topics, address, transactionHash } = log;
		let [, from, to] = topics;

		to = this.decode(to);

		if (this.watchList.find(BigInt(to)) !== null) {
			from = this.decode(from);
			const value = this.web3.utils.hexToNumberString(data);

			return { hash: transactionHash, address, from, to, value, log };
		}
	}

	private decode(hex: string): string {
		return "0x" + hex.slice(-40);
	}
}
