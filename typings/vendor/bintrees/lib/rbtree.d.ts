export = RBTree;
declare const RBTree_base: typeof import("./treebase");
declare class RBTree extends RBTree_base {
    constructor(comparator: any);
    _comparator: any;
    insert(data: any): boolean;
    remove(data: any): boolean;
}
