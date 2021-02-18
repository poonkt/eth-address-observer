<img style="margin-top: 30px; margin-bottom: 20px" src="assets/logo/poonkt-logo.svg" width="250" alt="poonkt" />

# Ethereum Address Observer

![GitHub Workflow Status][github-ci-status] ![npm][npm-downloads] ![GitHub][github-license] ![npm][npm-version]

Ethereum addresses observer is part of poonkt.io cryptocurrency exchange.
The library is used with combination of [web3.js](https://www.npmjs.com/package/web3).
You need to run a local or remote [Ethereum](https://www.ethereum.org/) node to use this library.

## Installation

```bash
npm install eth-address-observer
```

## Usage

```js
const Web3 = require("web3");
const { EthAddressObserver } = require("eth-address-observer");
import { EthAddressObserver } from "eth-address-observer"; // or

/** Requires websocket or ipc provider */
const web3 = new Web3("ws://localhost:8546");

/** Optional config */
const config = {
	confirmationsRequired: 12, // default
	erc20: {
		confirmationsRequired: 12 // default
	}
};
const observer = new EthAddressObserver(web3, config);
```

Adding, removing and listing:

```js
/** Adding ethereum address to observer */
observer.add("0x0000000000000000000000000000000000000000");
observer.add(["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000001"]);

/** Removing ethereum address from observer */
observer.remove("0x0000000000000000000000000000000000000000");
observer.remove(["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000001"]);

/** Show observable addresses */
console.log(observer.list);
```

Listening for incoming transactions:

```js
/** Subscribing to changes */
/** Emits ever transaction in pending state */
observer.subscribe("pending", (transactionHash) => {
	const transaction = await web3.eth.getTransaction(transactionHash);

	console.log(
		`${transaction.to}: Transaction: ${transaction.hash} in PENDING state`
	);
});
/** Emits at every confirmation */
observer.subscribe("confirmation", (confirmationNumber, transactionHash) => {
	const transaction = await web3.eth.getTransaction(transactionHash);

	console.log(
		`${transaction.to}: Transaction: ${transaction.hash} new CONFIRMATION: ${confirmationNumber}, in block ${transaction.blockHash}`
	);
});
/** When transaction reach required amount of confirmations */
observer.subscribe("success", async (transactionHash) => {
	const transaction = await web3.eth.getTransaction(transactionHash);

	console.log(
		`${transaction.to}: Transaction: ${transaction.hash} is CONFIRMED!`
	);
});
```

Listening for incoming token transfers:

```js
const tokens = new Map();
tokens.set("0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c".toLowerCase(), {
	name: "XEENUS",
	decimals: 18
});
tokens.set("0x1f9061B953bBa0E36BF50F21876132DcF276fC6e".toLowerCase(), {
	name: "ZEENUS",
	decimals: 0
});

function getTokenInfo(address) {
	return tokens.get(address.toLowerCase()) || { name: "unknown token", decimals: "unknown" };
}

/** For any valid erc20 tokens with Transfer(address,address,uint256) event interface */
observer.subscribe("transfer-pending", (transactionHash, erc20Transfer) => {
	const { hash, address, from, to, value, log } = erc20Transfer;

	const tokenInfo = getTokenInfo(address);
	console.log(`${to}: ${tokenInfo.name} Transaction: ${transactionHash} in PENDING state`);
});

observer.subscribe("transfer-confirmation", (confirmationNumber, transactionHash, erc20Transfer) => {
	const { hash, address, from, to, value, log } = erc20Transfer;

	const tokenInfo = getTokenInfo(address);
	console.log(
		`${to}: ${tokenInfo.name} Transaction: ${transactionHash} new CONFIRMATION: ${confirmationNumber}, in block ${log.blockHash}`
	);
});

observer.subscribe("transfer-success", (transactionHash, erc20Transfer) => {
	const { hash, address, from, to, value, log } = erc20Transfer;

	const tokenInfo = getTokenInfo(address);
	console.log(`${to}: ${tokenInfo.name} Transaction: ${transactionHash} is CONFIRMED!`);
});
```

## Sponsorship

If you like the product please donate:

- **BTC:** bc1q9l3h6fkg4pznglaeupl7j94vk3fs8k4ssvg6zz
- **ETH:** 0x4a90366BE03B1b0bAd024e833a18C8602a4291A0
- **XRP:** rwUmFRpwX69eTkMMGmity1TgC4FSvday7z
- **BCH** qrcyfuyr33lxvzjceuqq4sxnwwd3fxty0cg5fhpatm
- **ERC-20 TOKENS:** 0x4a90366BE03B1b0bAd024e833a18C8602a4291A0

[github-ci-status]: https://img.shields.io/github/workflow/status/snitovets/eth-address-observer/test-ci?style=flat-square
[github-license]: https://img.shields.io/github/license/snitovets/eth-address-observer?style=flat-square
[npm-downloads]: https://img.shields.io/npm/dt/eth-address-observer?style=flat-square
[npm-version]: https://img.shields.io/npm/v/eth-address-observer?color=blue&style=flat-square
