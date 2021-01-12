/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-done-callback */
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
 * @file concurrency.test.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */

import Web3 from "web3";
import { EthAddressesObserver } from "../lib/eth/eth-addresses-observer";
import {
	addressGenerator,
	generateAddressesList,
	shuffleAddressToList
} from "./utils/address";
const generator = addressGenerator();

const provider = new Web3.providers.WebsocketProvider(`ws://geth:8546`);
const web3 = new Web3(provider);

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
				resolve(true);
			}, transactionDelay);
		});
	}
}

const listSize = 100;
const transactionDelay = 1000;

it("Should detect pending transaction in flood of third party transactions ~50tx/sec and watch until confirmed", async (done) => {
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

it("Should detect pending transaction while new transactions incoming", async (done) => {
	const coinbaseAddress = await web3.eth.getCoinbase();

	const addresses = generateAddressesList(25000);

	const observer = new EthAddressesObserver(web3);
	observer.add(addresses);

	let pending = 0;
	observer.subscribe("pending", () => {
		pending++;

		if (pending === 25000) {
			done();
		}
	});

	for (let i = 0; i < addresses.length; i++) {
		const random = Math.floor(Math.random() * addresses.length);

		web3.eth.sendTransaction({
			from: coinbaseAddress,
			to: addresses[random],
			value: web3.utils.toWei("1", "ether")
		});
	}
}, 400000);
