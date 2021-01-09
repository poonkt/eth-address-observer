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
 * @file eth-addresses-observer.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */

import Web3 from "web3";
import {
	AddressesObserver,
	AddressesObserverConfig
} from "../addresses-observer";
import { EthBlocksCollector } from "./eth-blocks-collector";
import { EthTransactionsCollector } from "./eth-transactions-collector";
import { EthTransactionsManager } from "./eth-transactions-manager";

export type EthAddressesObserverConfig = Partial<AddressesObserverConfig>;

export type SubscriptionType =
	| "pending"
	| "confirmation"
	| "success"
	| "dropped";

export class EthAddressesObserver extends AddressesObserver {
	ethBlocksCollector: EthBlocksCollector;
	ethTransactionsCollector: EthTransactionsCollector;
	ethTransactionsManager: EthTransactionsManager;

	constructor(web3: Web3, config: EthAddressesObserverConfig = {}) {
		config.confirmationsRequired = config.confirmationsRequired || 12;
		super(config as AddressesObserverConfig);

		this.ethBlocksCollector = new EthBlocksCollector(
			web3,
			config.blocksCacheSize
		);
		this.ethTransactionsCollector = new EthTransactionsCollector(
			this.watchList,
			config.transactionsCacheSize
		);
		this.ethTransactionsManager = new EthTransactionsManager(
			web3,
			config.confirmationsRequired
		);

		this.ethBlocksCollector.on(
			"new-block",
			async (latestBlockNumber: number) => {
				await this.process(web3, latestBlockNumber);
			}
		);

		this.ethTransactionsCollector.on(
			"new-transaction",
			async (transactionHash: string) => {
				await this.ethTransactionsManager.add(transactionHash);
			}
		);
	}

	subscribe<T>(type: SubscriptionType, handler: (...args: T[]) => void): void {
		this.ethTransactionsManager.on(type, handler);
	}

	toBigInt(address: string): bigint {
		return BigInt(address);
	}

	toAddress(number: bigint): string {
		const hex = number.toString(16);
		const address =
			"0x" +
			Array(40 - hex.length)
				.fill(0)
				.join("") +
			hex;

		return address;
	}

	private async process(web3: Web3, blockNumber: number): Promise<void> {
		try {
			const { transactions } = await web3.eth.getBlock(blockNumber, true);

			this.ethTransactionsCollector.add(transactions);
			this.ethTransactionsManager.process(blockNumber);
		} catch (error) {
			this.process(web3, blockNumber);
		}
	}
}
