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
 * @file index.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */

export type SubscriptionType =
	| "pending"
	| "confirmation"
	| "success"
	| "dropped";
export interface IAddressesObserverConfig {
	confirmationsRequired: number;
	blocksCacheSize?: number;
	transactionsCacheSize?: number;
}
export interface ICollector {
	listen(): void;
}
export interface ICollectorCache {
	add(data: number | string, cb: (error: string | null) => void): void;
}
export interface IEthAddressesObserver {
	subscribe<T>(type: SubscriptionType, handler: (data: T) => void): void;
}
export type IEthAddressesObserverConfig = Partial<IAddressesObserverConfig>;
