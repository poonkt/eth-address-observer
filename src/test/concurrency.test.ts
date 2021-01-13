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
import { EthAddressesObserver } from "../lib/eth/eth-addresses-observer";
import {
	addressGenerator,
	generateAddressesList,
	shuffleAddressToList
} from "./utils/address";

describe("Concurrency testing", () => {
	it("Should detect pending transaction while new transactions incoming", async (done) => {
		const coinbaseAddress = await global.web3.eth.getCoinbase();

		const addresses = generateAddressesList(1000);

		const observer = new EthAddressesObserver(global.web3);
		observer.add(addresses);

		const pendingCb = jest.fn();
		observer.subscribe("pending", pendingCb);

		setTimeout(() => {
			expect(pendingCb.mock.calls.length).toBe(1000 * 5);
			done();
		}, 150000);

		for (let i = 0; i < addresses.length * 5; i++) {
			const random = Math.floor(Math.random() * addresses.length);

			global.web3.eth.sendTransaction({
				from: coinbaseAddress,
				to: addresses[random],
				value: global.web3.utils.toWei("1", "ether")
			});
		}
	});

	it("Should detect single pending transaction in the flood of third party transactions", async (done) => {
		const coinbaseAddress = await global.web3.eth.getCoinbase();

		const generator = addressGenerator();
		const desiredAddress = generator.next().value;
		const addresses = generateAddressesList(1000000);

		const observer = new EthAddressesObserver(global.web3);
		observer.add(desiredAddress);
		observer.add(addresses);

		const recipients = shuffleAddressToList(
			desiredAddress,
			generateAddressesList(5000 - 1)
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
		observer.subscribe("success", async () => {
			commits.success = true;

			const balance = global.web3.utils.fromWei(
				await global.web3.eth.getBalance(desiredAddress),
				"ether"
			);
			expect(balance).toBe("1");
			expect(commits.pending).toBeTruthy();
			expect(commits.confirmation).toBeTruthy();
			expect(commits.success).toBeTruthy();
			done();
		});

		for (let i = 0; i < 5000; i++) {
			global.web3.eth.sendTransaction({
				from: coinbaseAddress,
				to: recipients[i],
				value: global.web3.utils.toWei("1", "ether")
			});
		}
	});
});
