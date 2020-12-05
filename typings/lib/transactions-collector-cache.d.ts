/**
 * @file transactions-collector-cache.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
export declare class TransactionsCollectorCache {
    private readonly cache;
    constructor(transactionsCacheSize: number);
    add(transactionHash: string, cb: (error: string | null) => void): void;
    private setup;
}
