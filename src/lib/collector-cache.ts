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
 * @file collector-cache.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */

export class CollectorCache<T extends number | string> {
	private readonly cache: T[];

	constructor(cacheSize: number) {
		this.cache = [];
		this.setup(cacheSize);
	}

	add(data: T, cb: (error: string | null) => void): void {
		if (!this.cache.includes(data)) {
			this.cache.push(data);
			return cb(null);
		}

		return cb("Duplicate skipped");
	}

	private setup(cacheSize: number): void {
		this.cache.push = function (data: T) {
			if (this.length >= cacheSize) {
				this.shift();
			}

			return Array.prototype.push.call(this, data);
		};
	}
}
