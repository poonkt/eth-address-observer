class Iterator {
	constructor(tree) {
		this._tree = tree;
		this._ancestors = [];
		this._cursor = null;
	}
	data() {
		return this._cursor !== null ? this._cursor.data : null;
	}
	// if null-iterator, returns first node
	// otherwise, returns next node
	next() {
		if (this._cursor === null) {
			var root = this._tree._root;
			if (root !== null) {
				this._minNode(root);
			}
		} else {
			if (this._cursor.right === null) {
				// no greater node in subtree, go up to parent
				// if coming from a right child, continue up the stack
				var save;
				do {
					save = this._cursor;
					if (this._ancestors.length) {
						this._cursor = this._ancestors.pop();
					} else {
						this._cursor = null;
						break;
					}
				} while (this._cursor.right === save);
			} else {
				// get the next node from the subtree
				this._ancestors.push(this._cursor);
				this._minNode(this._cursor.right);
			}
		}
		return this._cursor !== null ? this._cursor.data : null;
	}
	// if null-iterator, returns last node
	// otherwise, returns previous node
	prev() {
		if (this._cursor === null) {
			var root = this._tree._root;
			if (root !== null) {
				this._maxNode(root);
			}
		} else {
			if (this._cursor.left === null) {
				var save;
				do {
					save = this._cursor;
					if (this._ancestors.length) {
						this._cursor = this._ancestors.pop();
					} else {
						this._cursor = null;
						break;
					}
				} while (this._cursor.left === save);
			} else {
				this._ancestors.push(this._cursor);
				this._maxNode(this._cursor.left);
			}
		}
		return this._cursor !== null ? this._cursor.data : null;
	}
	_minNode(start) {
		while (start.left !== null) {
			this._ancestors.push(start);
			start = start.left;
		}
		this._cursor = start;
	}
	_maxNode(start) {
		while (start.right !== null) {
			this._ancestors.push(start);
			start = start.right;
		}
		this._cursor = start;
	}
}

module.exports = Iterator;
