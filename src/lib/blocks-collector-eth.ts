import Web3 from "web3";
import { BlocksCollectorCache } from "./blocks-collector-cache";
import { IBlocksCollectorCacheConfig, ICollector } from "typings";

export class BlocksCollectorEth implements ICollector {
	private readonly web3: Web3;
	private readonly blocksCollectorCache: BlocksCollectorCache;

	constructor(web3: Web3, config: IBlocksCollectorCacheConfig) {
		this.web3 = web3;
		this.blocksCollectorCache = new BlocksCollectorCache(config);

		this.listen();
	}

	listen(): void {
		this.web3.eth
			.subscribe("newBlockHeaders")
			.on("data", (blockHeader) => {
				this.blocksCollectorCache.add(blockHeader.number);
			})
			.on("error", (error) => {
				console.log(error);
			});
	}
}
