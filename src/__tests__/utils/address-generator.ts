import crypto from "crypto";

export function* addressGenerator(): Generator<string> {
	while (true) {
		yield "0x" + crypto.randomBytes(20).toString("hex");
	}
}
