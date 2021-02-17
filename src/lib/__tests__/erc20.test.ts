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
 * @file erc20.test.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
/* eslint-disable jest/no-done-callback */
import Web3 from "web3";
import { EthAddressesObserver } from "../eth/eth-addresses-observer";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { abi, bytecode } from "./contracts/BasicToken.json";
import { addressGenerator, generateAddressesList, shuffleAddressToList } from "./utils/address";
import { ERC20Transfer } from "../eth/erc20-transactions-collector";

jest.setTimeout(60000);

const provider = new Web3.providers.WebsocketProvider(`ws://geth:8546`);
const web3 = new Web3(provider);

const generator = addressGenerator();

let coinbase: string;

let pnktToken: Contract;

beforeAll(async () => {
	[coinbase] = await web3.eth.getAccounts();

	const contract = new web3.eth.Contract(abi as AbiItem[]);

	pnktToken = await contract
		.deploy({ data: bytecode, arguments: ["1000000000000000000", "Poonkt Token", "PNKT"] })
		.send({ from: coinbase, gas: 3000000 });
});

it("Catch incoming transfer to observable address", async (done) => {
	const observer = new EthAddressesObserver(web3);

	const address = generator.next().value;

	observer.add(address);
	observer.subscribe("token-transfer", (erc20Transfer: ERC20Transfer) => {
		expect(erc20Transfer).toMatchObject({
			address: pnktToken.options.address,
			from: coinbase.toLowerCase(),
			to: address,
			value: "1000"
		});

		done();
	});

	await pnktToken.methods.transfer(address, "1000").send({
		from: coinbase
	});
});

it("Catch incoming transfer to observable address in flood of transactions", async (done) => {
	const observer = new EthAddressesObserver(web3);

	const address = generator.next().value;

	const recipients = shuffleAddressToList(address, generateAddressesList(999));

	observer.add(address);
	observer.subscribe("token-transfer", (erc20Transfer: ERC20Transfer) => {
		expect(erc20Transfer).toMatchObject({
			address: pnktToken.options.address,
			from: coinbase.toLowerCase(),
			to: address,
			value: "1000"
		});

		done();
	});

	for (let i = 0; i < recipients.length; i++) {
		await new Promise((resolve) => {
			setTimeout(async () => {
				pnktToken.methods.transfer(recipients[i], "1000").send({
					from: coinbase
				});
				resolve(true);
			}, 0);
		});
	}
});
