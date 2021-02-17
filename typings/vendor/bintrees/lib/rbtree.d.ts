export = RBTree;
declare class RBTree extends TreeBase {
    constructor(comparator: any);
    _comparator: any;
    insert(data: any): boolean;
    remove(data: any): boolean;
}
import TreeBase = require("./treebase");
