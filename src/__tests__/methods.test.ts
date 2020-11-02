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
 * @file methods.test.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import dotenv from "dotenv";
dotenv.config();

import Web3 from "web3";
import EthAddressesObserver from "..";
import { addressGenerator } from "./utils/address-generator";

const provider = new Web3.providers.WebsocketProvider(
	`ws://${process.env.HOST}`
);
const web3 = new Web3(provider);

describe("add()", () => {
	test("Should insert 1000000 addresses to watch-list (string)", async () => {
		const observer = new EthAddressesObserver(web3);

		const generator = addressGenerator();
		const length = 1000000;
		for (let i = 0; i < length; i++) {
			observer.add(generator.next().value);
		}

		expect(observer.list.length).toBe(length);
	});

	test("Should insert 1000000 addresses to watch-list (array)", async () => {
		const observer = new EthAddressesObserver(web3);

		const generator = addressGenerator();
		const length = 1000000;
		const arr = [];
		for (let i = 0; i < length; i++) {
			arr.push(generator.next().value);
		}
		observer.add(arr);

		expect(observer.list.length).toBe(length);
	});
});

describe("remove()", () => {
	test("Should remove 950000 addresses from watch-list of 1000000 addresses (string)", async () => {
		const observer = new EthAddressesObserver(web3);

		const generator = addressGenerator();
		const length = 1000000;
		const addresses = [];
		for (let i = 0; i < length; i++) {
			addresses.push(generator.next().value);
		}
		addresses.forEach((address) => {
			observer.add(address);
		});

		const length2 = 950000;
		const toRemove = addresses.slice(0, length2);
		toRemove.forEach((address) => {
			observer.remove(address);
		});

		expect(observer.list.length).toBe(length - length2);
	});

	test("Should remove 950000 addresses from watch-list of 1000000 addresses (array)", async () => {
		const observer = new EthAddressesObserver(web3);

		const generator = addressGenerator();
		const length = 1000000;
		const addresses = [];
		for (let i = 0; i < length; i++) {
			addresses.push(generator.next().value);
		}
		observer.add(addresses);

		const length2 = 950000;
		const toRemove = addresses.slice(0, length2);
		observer.remove(toRemove);

		expect(observer.list.length).toBe(length - length2);
	});
});

describe("random tests", () => {
	test("Should randomly add(), remove()", async () => {
		const observer = new EthAddressesObserver(web3);
		const command = ["add", "remove"];
		const commandsList = [];

		for (let i = 0; i < 1000000; i++) {
			const random = Math.floor(Math.random() * 2);
			commandsList.push(command[random]);
		}

		const generator = addressGenerator();
		const addresses = [];
		for (let i = 0; i < 1000000; i++) {
			addresses.push(generator.next().value);
		}
		const addedAddresses = [];

		commandsList.forEach((command) => {
			switch (command) {
				case "add":
					{
						const index = Math.floor(Math.random() * 10);
						if (addedAddresses.includes(addresses[index])) break;
						observer.add(addresses[index]);
						addedAddresses.push(addresses[index]);
					}
					break;
				case "remove": {
					if (!addedAddresses.length) break;
					const index = Math.floor(Math.random() * addedAddresses.length);
					observer.remove(addedAddresses[index]);
					addedAddresses.splice(index, 1);
				}
			}
		});

		expect(observer.list.length).toBe(addedAddresses.length);
	});
});
