/* eslint-disable @typescript-eslint/no-namespace */
import Web3 from "web3";

jest.setTimeout(1000000);

declare global {
	namespace NodeJS {
		interface Global {
			web3: Web3 | null;
		}
	}
}

const provider = new Web3.providers.WebsocketProvider(`ws://geth:8546`);
global.web3 = new Web3(provider);
