/* eslint-disable @typescript-eslint/no-var-requires */
const Web3 = require("web3");
const EthBlockchainObserver = require(".");

const web3 = new Web3("ws://localhost:8546");
const observer = new EthBlockchainObserver(web3, {
	latestBlock: 0,
	confirmationsRequired: 5
});
observer.add(["0x2C19E600182232a5D09bFCF5dE2149b66Be4A7E7"]);
observer.subscribe("pending", (transactionReceipt) => {});
