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
import { EventEmitter } from "events";
import { CollectorCache } from "../collector-cache";

export class EthBlocksCollector extends EventEmitter {
	private readonly web3: Web3;
	private readonly blocksCollectorCache: CollectorCache<number>;

	constructor(web3: Web3, blocksCacheSize: number) {
		super();
		this.web3 = web3;
		this.blocksCollectorCache = new CollectorCache(blocksCacheSize);

		this.listen();
	}

	listen(): void {
		const subscription = this.web3.eth
			.subscribe("newBlockHeaders")
			.on("data", (blockHeader) => {
				this.blocksCollectorCache.add(blockHeader.number, (error) => {
					if (!error) {
						this.emit("new-block", blockHeader.number);
					}
				});
			})
			.on("error", () => {
				subscription.unsubscribe(() => {
					this.listen();
				});
			});
	}
}
