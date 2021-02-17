export = TreeBase;
declare class TreeBase {
    clear(): void;
    _root: any;
    size: number;
    find(data: any): any;
    findIter(data: any): Iterator;
    lowerBound(item: any): Iterator;
    upperBound(item: any): Iterator;
    min(): any;
    max(): any;
    iterator(): Iterator;
    each(cb: any): void;
    reach(cb: any): void;
}
import Iterator = require("./iterator");
