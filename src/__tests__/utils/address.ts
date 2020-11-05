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
 * @file address.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
import crypto from "crypto";

export function* addressGenerator(): Generator<string> {
	while (true) {
		yield "0x" + crypto.randomBytes(20).toString("hex");
	}
}

export function generateAddressesList(size: number): string[] {
	const generator = addressGenerator();

	const recipients = [];
	for (let i = 0; i < size; i++) {
		recipients.push(generator.next().value);
	}

	return recipients;
}

export function shuffleAddressToList(
	address: string,
	list: string[]
): string[] {
	const position = Math.floor(Math.random() * (list.length + 1));
	list.splice(position, 0, address);

	return list;
}
