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
 * @file transactions-collector-cache.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */

import { ICollectorCache } from "typings";

export class TransactionsCollectorCache implements ICollectorCache {
	private readonly cache: string[];

	constructor(transactionsCacheSize: number) {
		this.cache = [];
		this.setup(transactionsCacheSize);
	}

	add(transactionHash: string, cb: (error: string | null) => void): void {
		if (!this.cache.includes(transactionHash)) {
			this.cache.push(transactionHash);
			return cb(null);
		}

		return cb("Detected transaction duplicate, processing discarded");
	}

	private setup(cacheSize: number): void {
		this.cache.push = function (transactionHash: string) {
			if (this.length >= cacheSize) {
				this.shift();
			}

			return Array.prototype.push.call(this, transactionHash);
		};
	}
}
