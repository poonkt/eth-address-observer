export { EthAddressesObserver as default } from "./lib/eth/eth-addresses-observer";

// development testing section
import Web3 from "web3";
import EthAddressesObserver from ".";

const web3 = new Web3("ws://localhost:8546");
const observer = new EthAddressesObserver(web3, {
	latestBlock: 0,
	confirmationsRequired: 12
});

// adding many addresses for testing performance
for (let i = 0; i < 10000000; i++) {
	const hex = i.toString(16);
	const address =
		"0x" +
		Array(40 - hex.length)
			.fill(0)
			.join("") +
		hex;

	observer.add(address);
}
observer.add("0x2C19E600182232a5D09bFCF5dE2149b66Be4A7E7");

observer.subscribe("pending", (transaction) => {
	console.log(
		`${transaction.to}: transaction: ${transaction.hash} now at PENDING state, block: ${transaction.blockNumber}`
	);
});
observer.subscribe("in-block", (transaction) => {
	const transactionReceipt = transaction[0];
	const confirmations = transaction[1];
	console.log(
		`${transactionReceipt.to}: transaction: ${transactionReceipt.transactionHash} now IN-BLOCK state, block: ${transactionReceipt.blockNumber} and just have ${confirmations} confirmations!`
	);
});
// Caused by blockchain reorganization
observer.subscribe("dropped", (transaction) => {
	console.log(
		`${transaction.to}: transaction: ${transaction.transactionHash} was DROPPED, block: ${transaction.blockNumber}`
	);
});
observer.subscribe("confirmed", (transaction) => {
	console.log(
		`${transaction.to}: transaction: ${transaction.transactionHash} now at CONFIRMED state, block: ${transaction.blockNumber}, removing from watch-list`
	);
});
