/**
 * @file blocks-collector-cache.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2020
 */
export declare class BlocksCollectorCache {
    private readonly cache;
    constructor(blocksCacheSize: number);
    add(blockNumber: number, cb: (error: string | null) => void): void;
    private setup;
}
