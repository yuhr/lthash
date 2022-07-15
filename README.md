<div align="center"><br><br>

# LtHash

[![GitHub](https://img.shields.io/github/license/yuhr/lthash?color=%231e2327)](LICENSE)

[LtHash](https://eprint.iacr.org/2019/227.pdf) implementation in pure JavaScript.

<br><br></div>

`lthash` provides a minimal API to construct Facebook's LtHash (see Section 2.3 of [the whitepaper](https://eprint.iacr.org/2019/227.pdf)). This package exports a single class `LtHash` that extends [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

It's bundled with [`dnt`](https://github.com/denoland/dnt), so it should work in browsers, Deno and Node.js.

## Installation

For Deno, pick your favorite registry from the following:

- `import LtHash from "https://nest.land/package/lthash/src/index.ts"`
- `import LtHash from "https://deno.land/x/lthash/index.ts"`
- `import LtHash from "https://esm.sh/lthash"`

For Node.js, just install `lthash` from the npm registry:

- `npm install lthash`
- `pnpm add lthash`
- `yarn add lthash`

## Usage

```ts
import { Shake256 } from "https://deno.land/std/hash/sha3.ts"
import { encode } from "https://deno.land/std/encoding/hex.ts"
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import LtHash from "https://deno.land/x/lthash/LtHash.ts"

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
	assertEquals(hex(lthash),                 "000000000000000000000000")
	assertEquals(hex(lthash.add("hello")),    "1234075ae4a1e77316cf2d80")
	assertEquals(hex(lthash.add("world")),    "81325c99041731d8b089173c")
	assertEquals(hex(lthash.remove("world")), "1234075ae4a1e77316cf2d80")
	assertEquals(hex(lthash.remove("hello")), "000000000000000000000000")
	assertEquals(hex(lthash.add("world")),    "6ffe553f20764a659abaeabc")
	assertEquals(hex(lthash.add("hello")),    "81325c99041731d8b089173c")
	assertEquals(hex(lthash.remove("world")), "1234075ae4a1e77316cf2d80")
	assertEquals(hex(lthash.remove("hello")), "000000000000000000000000")
})
```