export = TreeBase;
declare class TreeBase {
    clear(): void;
    _root: any;
    size: number;
    find(data: any): any;
    findIter(data: any): import("./iterator");
    lowerBound(item: any): import("./iterator");
    upperBound(item: any): import("./iterator");
    min(): any;
    max(): any;
    iterator(): import("./iterator");
    each(cb: any): void;
    reach(cb: any): void;
}
