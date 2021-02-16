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
 * @file transactions.test.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
/* eslint-disable jest/no-done-callback */
import Web3 from "web3";
import { EthAddressesObserver } from "../eth/eth-addresses-observer";
import { addressGenerator, generateAddressesList, shuffleAddressToList } from "./utils/address";
const generator = addressGenerator();

jest.setTimeout(120000);

const provider = new Web3.providers.WebsocketProvider(`ws://geth:8546`);
const web3 = new Web3(provider);

test("Should detect pending transaction in flood of transactions", async (done) => {
	const coinbase = await web3.eth.getCoinbase();

	const desiredAddress = generator.next().value;
	const addresses = generateAddressesList(1000000);

	const observer = new EthAddressesObserver(web3);
	observer.add(desiredAddress);
	observer.add(addresses);

	const recipients = shuffleAddressToList(desiredAddress, generateAddressesList(999));

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

		const balance = web3.utils.fromWei(await web3.eth.getBalance(desiredAddress), "ether");
		expect(balance).toBe("1");
		expect(commits.pending).toBeTruthy();
		expect(commits.confirmation).toBeTruthy();
		expect(commits.success).toBeTruthy();

		done();
	});

	for (let i = 0; i < recipients.length; i++) {
		await new Promise((resolve) => {
			setTimeout(async () => {
				web3.eth.sendTransaction({
					from: coinbase,
					to: recipients[i],
					value: web3.utils.toWei("1", "ether")
				});
				resolve(true);
			}, 0);
		});
	}
});
