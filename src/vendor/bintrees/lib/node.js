class Node {
	constructor(data) {
		this.data = data;
		this.left = null;
		this.right = null;
		this.red = true;
	}
	get_child(dir) {
		return dir ? this.right : this.left;
	}
	set_child(dir, val) {
		if (dir) {
			this.right = val;
		} else {
			this.left = val;
		}
	}
}

module.exports = Node;
