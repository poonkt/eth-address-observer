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
 * @date 2021
 */

import Web3 from "web3";
import { AddressesObserver, AddressesObserverConfig } from "../addresses-observer";
import { ERC20TransactionsCollector, ERC20Transfer } from "./erc20-transactions-collector";
import { EthBlocksCollector } from "./eth-blocks-collector";
import { EthTransactionsCollector } from "./eth-transactions-collector";
import { TransactionsManager } from "./transactions-manager";

export interface EthAddressesObserverConfig extends Partial<AddressesObserverConfig> {
	erc20?: {
		confirmationsRequired?: number;
		cacheSize?: number;
	};
}

export type SubscriptionType =
	| "pending"
	| "confirmation"
	| "success"
	| "transfer-pending"
	| "transfer-confirmation"
	| "transfer-success";
export class EthAddressesObserver extends AddressesObserver {
	private readonly web3: Web3;

	private readonly ethBlocksCollector: EthBlocksCollector;

	private readonly ethTransactionsCollector: EthTransactionsCollector;
	private readonly ethTransactionsManager: TransactionsManager;

	private readonly erc20TransactionsCollector: ERC20TransactionsCollector;
	private readonly erc20TransactionsManager: TransactionsManager;

	private readonly retryCollectTransactionsQueue: Set<string>;
	private readonly retryAddTransactionQueue: Set<string>;
	private readonly retryAddERC20TransferQueue: Set<ERC20Transfer>;

	constructor(web3: Web3, config?: EthAddressesObserverConfig) {
		const _config = {
			transactionsCacheSize: config?.transactionsCacheSize || 2048,
			blocksCacheSize: config?.blocksCacheSize || 128,
			confirmationsRequired: config?.confirmationsRequired || 12,
			erc20: {
				confirmationsRequired: config?.erc20?.confirmationsRequired || 12,
				cacheSize: config?.erc20?.cacheSize || 512
			}
		};

		super(_config as AddressesObserverConfig);

		this.web3 = web3;

		this.ethBlocksCollector = new EthBlocksCollector(web3, _config.blocksCacheSize);

		this.ethTransactionsCollector = new EthTransactionsCollector(this.watchList, _config.transactionsCacheSize);
		this.ethTransactionsManager = new TransactionsManager(web3, _config.confirmationsRequired);

		this.erc20TransactionsCollector = new ERC20TransactionsCollector(
			web3,
			this.watchList,
			_config.transactionsCacheSize
		);
		this.erc20TransactionsManager = new TransactionsManager(web3, _config.erc20.confirmationsRequired);

		this.retryCollectTransactionsQueue = new Set();
		this.retryAddTransactionQueue = new Set();
		this.retryAddERC20TransferQueue = new Set();

		this.ethBlocksCollector.on("block", (blockHash: string) => {
			this.collectTransactions(blockHash);
		});
		this.ethBlocksCollector.on("new-block", (blockNumber: number) => {
			this.retry(this.retryCollectTransactionsQueue, this.collectTransactions.bind(this));
			this.retry(this.retryAddTransactionQueue, this.addTransaction.bind(this));
			this.retry(this.retryAddERC20TransferQueue, this.addERC20Transfer.bind(this));

			this.processCycle(blockNumber);
		});

		this.ethTransactionsCollector.on("new-transaction", (transactionHash: string) => {
			this.addTransaction(transactionHash);
		});
		this.erc20TransactionsCollector.on("new-transfer", (transfer: ERC20Transfer) => {
			this.addERC20Transfer(transfer);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	subscribe(type: SubscriptionType, handler: (...args: any[]) => void): void {
		const str = type.split("-");

		if (str[0] === "transfer") {
			this.erc20TransactionsManager.on(str[1], handler);
		} else {
			this.ethTransactionsManager.on(type, handler);
		}
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

	private async collectTransactions(blockHash: string) {
		try {
			const block = await this.web3.eth.getBlock(blockHash, true);

			if (!block) return;

			const { transactions, number } = block;
			const logs = await this.web3.eth.getPastLogs({
				fromBlock: number,
				topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
			});

			this.ethTransactionsCollector.add(transactions);
			this.erc20TransactionsCollector.add(logs);
		} catch (error) {
			this.retryCollectTransactionsQueue.add(blockHash);
		}
	}

	private async addTransaction(transactionHash: string) {
		try {
			await this.ethTransactionsManager.add(transactionHash);
		} catch (error) {
			this.retryAddTransactionQueue.add(transactionHash);
		}
	}

	private async addERC20Transfer(transfer: ERC20Transfer) {
		try {
			await this.erc20TransactionsManager.add(transfer.log.transactionHash, transfer);
		} catch (error) {
			this.retryAddERC20TransferQueue.add(transfer);
		}
	}

	private async processCycle(blockNumber: number) {
		try {
			this.ethTransactionsManager.process(blockNumber);
			this.erc20TransactionsManager.process(blockNumber);
		} catch (error) {
			this.processCycle(blockNumber);
		}
	}

	private async retry(set: Set<string | ERC20Transfer>, f: (data: string | ERC20Transfer) => Promise<void>) {
		if (set.size) {
			set.forEach((data) => {
				f(data);
			});
			set.clear();
		}
	}
}
