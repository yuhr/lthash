import { encode } from "std/encoding/hex.ts"
import { Shake256 } from "std/hash/sha3.ts"
import { assertEquals } from "std/testing/asserts.ts"
import LtHash from "../src/LtHash.ts"

const components = 12
const hasher = (entry: string) => {
	const shake = new Shake256(components * 8)
	shake.update(entry)
	return new Uint8Array(shake.digest())
}

const textDecoder = new TextDecoder()
const hex = (bytes: Uint8Array) => textDecoder.decode(encode(bytes))

Deno.test("add and remove using hasher", () => {
	const lthash = new LtHash(components, hasher)
	assertEquals("000000000000000000000000", hex(lthash))
	assertEquals("1234075ae4a1e77316cf2d80", hex(lthash.add("hello")))
	assertEquals("81325c99041731d8b089173c", hex(lthash.add("world")))
	assertEquals("1234075ae4a1e77316cf2d80", hex(lthash.remove("world")))
	assertEquals("000000000000000000000000", hex(lthash.remove("hello")))
	assertEquals("6ffe553f20764a659abaeabc", hex(lthash.add("world")))
	assertEquals("81325c99041731d8b089173c", hex(lthash.add("hello")))
	assertEquals("1234075ae4a1e77316cf2d80", hex(lthash.remove("world")))
	assertEquals("000000000000000000000000", hex(lthash.remove("hello")))
})

Deno.test("add and remove of another instance", () => {
	const lthash0 = new LtHash(components, hasher)
	const lthash1 = new LtHash(components, hasher)
	assertEquals("1234075ae4a1e77316cf2d80", hex(lthash0.add("hello")))
	assertEquals("6ffe553f20764a659abaeabc", hex(lthash1.add("world")))
	assertEquals("81325c99041731d8b089173c", hex(lthash0.add(lthash1)))
	assertEquals("eeccf9a61c5f198dea31d380", hex(lthash1.remove(lthash0)))
	assertEquals("000000000000000000000000", hex(lthash1.add("hello")))
})