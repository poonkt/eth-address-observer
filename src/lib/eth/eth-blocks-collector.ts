/**
 * @file eth-blocks-collector.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import { ICollector } from "typings";
import Web3 from "web3";
import { EventEmitter } from "events";
import { BlocksCollectorCache } from "../blocks-collector-cache";

export class EthBlocksCollector extends EventEmitter implements ICollector {
	private readonly web3: Web3;
	private readonly blocksCollectorCache: BlocksCollectorCache;

	constructor(web3: Web3, blocksCacheSize: number) {
		super();
		this.web3 = web3;
		this.blocksCollectorCache = new BlocksCollectorCache(blocksCacheSize);

		this.listen();
	}

	listen(): void {
		this.web3.eth
			.subscribe("newBlockHeaders")
			.on("data", (blockHeader) => {
				this.blocksCollectorCache.add(blockHeader.number, (error) => {
					if (!error) {
						this.emit("new-block", blockHeader.number);
					}
				});
			})
			.on("error", (error) => {
				console.log(error);
			});
	}
}
