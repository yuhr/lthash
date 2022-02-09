import LtHash from "../src/lthash.ts"
import { Shake256 } from "std/hash/sha3.ts"
import { encode } from "std/encoding/hex.ts"
import { assertEquals } from "std/testing/asserts.ts"

Deno.test("LtHash", async () => {
	const components = 12
	const hasher = (entry: string) => {
		const shake = new Shake256(components * 8)
		shake.update(entry)
		return new Uint8Array(shake.digest())
	}
	const textDecoder = new TextDecoder()
	const hex = (bytes: Uint8Array) => textDecoder.decode(encode(bytes))

	const lthash = new LtHash(components, hasher)
	assertEquals(hex(lthash), "000000000000000000000000")
	assertEquals(hex(lthash.add("hello")), "1234075ae4a1e77316cf2d80")
	assertEquals(hex(lthash.add("world")), "81325c99041731d8b089173c")
	assertEquals(hex(lthash.remove("world")), "1234075ae4a1e77316cf2d80")
	assertEquals(hex(lthash.remove("hello")), "000000000000000000000000")
	assertEquals(hex(lthash.add("world")), "6ffe553f20764a659abaeabc")
	assertEquals(hex(lthash.add("hello")), "81325c99041731d8b089173c")
	assertEquals(hex(lthash.remove("world")), "1234075ae4a1e77316cf2d80")
	assertEquals(hex(lthash.remove("hello")), "000000000000000000000000")
})