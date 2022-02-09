// https://eprint.iacr.org/2019/227.pdf

namespace LtHash {
	export type Hasher<T> = (entry: T) => Uint8Array
}

class LtHash<T> extends Uint8Array {
	protected hasher: LtHash.Hasher<T>

	/**
	 * @param length The length of the array.
	 * @param hasher A function that takes an arbitrary value of type you want and returns a `Uint8Array`. You MUST match the length of every output array to the `length` argument.
	 */
	constructor(length: number, hasher: LtHash.Hasher<T>) {
		super(length)
		this.hasher = hasher
	}

	/**
	 * Adds entry to the hash in place. Returns `this`.
	 */
	add(entry: T | LtHash<T>): LtHash<T> {
		if (entry instanceof LtHash) {
			for (const [i, n] of entry.entries()) {
				this[i] += n
			}
		} else {
			for (const [i, n] of this.hasher(entry).entries()) {
				this[i] += n
			}
		}
		return this
	}

	/**
	 * Removes entry from the hash in place. Returns `this`.
	 */
	remove(entry: T | LtHash<T>): LtHash<T> {
		if (entry instanceof LtHash) {
			for (const [i, n] of entry.entries()) {
				this[i] -= n
			}
		} else {
			for (const [i, n] of this.hasher(entry).entries()) {
				this[i] -= n
			}
		}
		return this
	}
}

export default LtHash