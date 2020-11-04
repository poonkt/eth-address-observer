<img style="margin-top: 30px; margin-bottom: 20px" src="assets/logo/poonkt-logo.svg" width="250" alt="poonkt" />

# Ethereum Address Observer

![GitHub Workflow Status][github-ci-status] ![npm][npm-downloads] ![GitHub][github-license] ![npm][npm-version]

Ethereum addresses observer is part of poonkt.io cryptocurrency exchange.
The library is used with combination of [web3.js](https://www.npmjs.com/package/web3).
You need to run a local or remote [Ethereum](https://www.ethereum.org/) node to use this library.

## Disclaimer

Library isn't well tested and possibly could contain bugs, **use it in production on your own risk**. Also feel free to contribute.

## Installation

```bash
npm install eth-address-observer
```

## Usage

```js
const Web3 = require("web3");
const { EthAddressesObserver } = require("eth-address-observer");

/** Requires exactly websocket provider,
 * also be careful using cloud providers,
 * library drains huge amount of requests */
const web3 = new Web3("ws://localhost:8546");

/** Optional config */
const config = {
	confirmationsRequired: 12; // default
};
const observer = new EthAddressesObserver(web3, config);
```

Adding, removing and listing:

```js
/** Adding ethereum address to observer */
observer.add("0x0000000000000000000000000000000000000000");
observer.add([
	"0x0000000000000000000000000000000000000000",
	"0x0000000000000000000000000000000000000001"
]);

/** Removing ethereum address from observer */
observer.remove("0x0000000000000000000000000000000000000000");
observer.remove([
	"0x0000000000000000000000000000000000000000",
	"0x0000000000000000000000000000000000000001"
]);

/** Show observable addresses */
console.log(observer.list);
```

Listening for incoming transactions:

```js
/** Subscribing to changes */
/** Emits ever transaction in pending state, sometimes could be skipped */
observer.subscribe("pending", (transaction) => {
	console.log(
		`${transaction.to}: Transaction: ${transaction.hash} in PENDING state`
	);
});
/** Emits at every confirmation */
observer.subscribe("confirmation", (confirmationNumber, transactionReceipt) => {
	console.log(
		`${transactionReceipt.to}: Transaction: ${transactionReceipt.transactionHash} new CONFIRMATION: ${confirmationNumber}, in block ${transactionReceipt.blockHash}`
	);
});
/** Caused by blockchain reorganization */
observer.subscribe("dropped", (transactionReceipt) => {
	console.log(
		`${transactionReceipt.to}: Transaction: ${transactionReceipt.transactionHash} is DROPPED from current block`
	);
});
/** When transaction reach required amount of confirmations */
observer.subscribe("success", (transactionReceipt) => {
	console.log(
		`${transactionReceipt.to}: Transaction: ${transactionReceipt.transactionHash} is CONFIRMED!`
	);
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
