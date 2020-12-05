export = Iterator;
declare class Iterator {
    constructor(tree: any);
    _tree: any;
    _ancestors: any[];
    _cursor: any;
    data(): any;
    next(): any;
    prev(): any;
    _minNode(start: any): void;
    _maxNode(start: any): void;
}
