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

Deno.test("add and remove using hasher", async () => {
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

Deno.test("add and remove of another instance", async () => {
	const lthash0 = new LtHash(components, hasher)
	const lthash1 = new LtHash(components, hasher)
	assertEquals(hex(lthash0.add("hello")), "1234075ae4a1e77316cf2d80")
	assertEquals(hex(lthash1.add("world")), "6ffe553f20764a659abaeabc")
	assertEquals(hex(lthash0.add(lthash1)), "81325c99041731d8b089173c")
	assertEquals(hex(lthash1.remove(lthash0)), "eeccf9a61c5f198dea31d380")
	assertEquals(hex(lthash1.add("hello")), "000000000000000000000000")
})