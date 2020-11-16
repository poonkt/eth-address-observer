import Web3 from "web3";
import ganache from "ganache-cli";

export default new Web3(
	ganache.provider({
		blockTime: 14,
		default_balance_ether: 666666666,
		total_accounts: 1
	})
);
