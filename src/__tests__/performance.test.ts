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
 * @file performance.test.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import web3 from "./utils/web3";
import EthAddressesObserver from "../lib/eth/eth-addresses-observer";
import {
	addressGenerator,
	generateAddressesList,
	shuffleAddressToList
} from "./utils/address";
const generator = addressGenerator();

async function detectionTest(
	transactionDelay: number,
	listSize: number,
	cb: (
		commits: {
			pending: boolean;
			confirmation: boolean;
			success: boolean;
		},
		address: string
	) => void
) {
	const coinbaseAddress = await web3.eth.getCoinbase();

	const desiredAddress = generator.next().value;
	const addresses = generateAddressesList(1000000);

	const observer = new EthAddressesObserver(web3);
	observer.add(desiredAddress);
	observer.add(addresses);

	const recipients = shuffleAddressToList(
		desiredAddress,
		generateAddressesList(listSize - 1)
	);

	const commits = {
		pending: false,
		confirmation: false,
		success: false
	};
	observer.subscribe("pending", () => {
		commits.pending = true;
	});
	observer.subscribe("confirmation", () => {
		commits.confirmation = true;
	});
	observer.subscribe("success", () => {
		commits.success = true;
		cb(commits, desiredAddress);
	});

	for (let i = 0; i < listSize; i++) {
		await new Promise((resolve) => {
			setTimeout(async () => {
				web3.eth.sendTransaction({
					from: coinbaseAddress,
					to: recipients[i],
					value: web3.utils.toWei("1", "ether")
				});
				resolve();
			}, transactionDelay);
		});
	}
}

const listSize = 160;
const transactionDelay = 1000;

describe("Transaction detection in list of 1000000 observable addresses to a dedicated address", () => {
	test("Should detect pending transaction in flood of transactions 1tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(transactionDelay, listSize, async (commits, address) => {
			const balance = web3.utils.fromWei(
				await web3.eth.getBalance(address),
				"ether"
			);
			expect(balance).toBe("1");
			expect(commits.pending).toBeTruthy();
			expect(commits.confirmation).toBeTruthy();
			expect(commits.success).toBeTruthy();
			done();
		});
	}, 400000);

	test("Should detect pending transaction in flood of transactions 2tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 2,
			listSize * 2,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);

	test("Should detect pending transaction in flood of transactions 4tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 4,
			listSize * 4,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);

	test("Should detect pending transaction in flood of transactions 8tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 8,
			listSize * 8,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);

	test("Should detect pending transaction in flood of transactions 12tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 12,
			listSize * 12,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);

	test("Should detect pending transaction in flood of transactions 15tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 15,
			listSize * 15,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);

	test("(experimental) Should detect pending transaction in flood of transactions 20tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 20,
			listSize * 20,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);

	test("(experimental) Should detect pending transaction in flood of transactions 30tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 30,
			listSize * 30,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);

	test("(experimental) Should detect pending transaction in flood of transactions ~50tx/sec and watch until confirmed. Expecting 1 ETH balance and commits from (pending, confirmation, success) events", async (done) => {
		detectionTest(
			transactionDelay / 50,
			listSize * 50,
			async (commits, address) => {
				const balance = web3.utils.fromWei(
					await web3.eth.getBalance(address),
					"ether"
				);
				expect(balance).toBe("1");
				expect(commits.pending).toBeTruthy();
				expect(commits.confirmation).toBeTruthy();
				expect(commits.success).toBeTruthy();
				done();
			}
		);
	}, 400000);
});
