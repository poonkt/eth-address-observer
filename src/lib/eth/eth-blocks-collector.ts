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
 * @file eth-blocks-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */

import Web3 from "web3";
import { WebsocketProvider } from "web3-core";
import { BlockHeader } from "web3-eth";
import { Subscription } from "web3-core-subscriptions";
import { EventEmitter } from "events";
import { CollectorCache } from "../collector-cache";

export class EthBlocksCollector extends EventEmitter {
	private readonly web3: Web3;
	private readonly provider: WebsocketProvider;
	private readonly blocksCollectorCache: CollectorCache<number>;
	private subscription: Subscription<BlockHeader>;

	constructor(web3: Web3, blocksCacheSize: number) {
		super();
		this.web3 = web3;
		this.blocksCollectorCache = new CollectorCache(blocksCacheSize);

		this.subscription = this.web3.eth.subscribe("newBlockHeaders");

		this.provider = this.web3.currentProvider as WebsocketProvider;
		this.provider.on("reconnect", () => {
			const fromBlock = this.blocksCollectorCache.cache[0];
			const toBlock = this.blocksCollectorCache.cache[this.blocksCollectorCache.cache.length - 1];

			this.rescan(fromBlock, toBlock);
		});

		this.listen();
	}

	listen(): void {
		this.subscription.on("data", (blockHeader) => {
			this.emit("block", blockHeader.hash);

			this.blocksCollectorCache.add(blockHeader.number, async (error) => {
				if (!error) {
					this.emit("new-block", blockHeader.number);
				}
			});
		});
	}

	private rescan(fromBlock: number, toBlock: number) {
		const missingBlocks: number[] = [];

		for (let i = fromBlock; i <= toBlock; i++) {
			if (this.blocksCollectorCache.cache.indexOf(i) == -1) {
				missingBlocks.push(i);
			}
		}

		missingBlocks.forEach((blockNumber) => {
			this.blocksCollectorCache.add(blockNumber, (error) => {
				if (!error) {
					this.emit("block", blockNumber);
				}
			});
		});

		if (missingBlocks.length) {
			this.blocksCollectorCache.cache.sort((a, b) => a - b);
		}
	}
}
