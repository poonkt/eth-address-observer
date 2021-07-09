/**
 * @file collector-cache.ts
 * @author Vitaly Snitovets <v.snitovets@gmail.com>
 * @date 2021
 */
export declare class CollectorCache<T extends number | string> {
    readonly cache: T[];
    constructor(cacheSize: number);
    add(data: T, cb: (error: string | null) => void): void;
    private setup;
}
