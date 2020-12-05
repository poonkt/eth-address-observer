export = Node;
declare class Node {
    constructor(data: any);
    data: any;
    left: any;
    right: any;
    red: boolean;
    get_child(dir: any): any;
    set_child(dir: any, val: any): void;
}
