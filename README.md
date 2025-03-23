[@zokugun/xtry](https://github.com/zokugun/node-xtry)
==========================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@zokugun/xtry.svg?colorB=green)](https://www.npmjs.com/package/@zokugun/xtry)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

Simple `try/catch` wrapper returning Result

Getting Started
---------------

With [node](http://nodejs.org) previously installed:

	npm install @zokugun/xtry

Basic Example
-------------

```typescript
import { xatry } from '@zokugun/xtry'

const { fails, value, error } = xatry(somePromise);
```

Advanced Example
----------------

```typescript
import { err, ok, type Result, xatry, xtry } from '@zokugun/xtry'

export type FoobarError = { type: 'FOOBAR'; message: string };

function foobar(): Result<number, FoobarError> {
    const { fails, value, error } = xatry(somePromise);

    if (fails) {
        return err({ type: 'FOOBAR', message: 'The promise has failed...' });
    }

    return ok(value);
}

function main() {
    const result = foobar();

    if (result.fails) {
        console.error(result.error.message);
        exit(1);
    }

    console.log(value);
}
```

API
---

```typescript
type Success<T> = {
    fails: false;
    value: T;
    error: null;
};
type Failure<E> = {
    fails: true;
    value: null;
    error: E;
};
export type Result<T, E> = Success<T> | Failure<E>;
export function xtry<T, E>(func: () => Exclude<T, Promise<unknown>>, handler?: ((error: E) => void)): Result<T, E>;
export async function xatry<T, E>(func: (() => Exclude<T, Promise<unknown>>) | Promise<Exclude<T, Promise<unknown>>>, handler?: ((error: E) => void)): Promise<Result<T, E>>;
export function ok<T>(value: T): Success<T>;
export function err<E>(error: E): Failure<E>;
```

Donations
---------

Support this project by becoming a financial contributor.

<table>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_kofi.png" alt="Ko-fi" width="80px" height="80px"></td>
        <td><a href="https://ko-fi.com/daiyam" target="_blank">ko-fi.com/daiyam</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_liberapay.png" alt="Liberapay" width="80px" height="80px"></td>
        <td><a href="https://liberapay.com/daiyam/donate" target="_blank">liberapay.com/daiyam/donate</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_paypal.png" alt="PayPal" width="80px" height="80px"></td>
        <td><a href="https://paypal.me/daiyam99" target="_blank">paypal.me/daiyam99</a></td>
    </tr>
</table>

License
-------

Copyright &copy; 2025-present Baptiste Augrain

Licensed under the [MIT license](https://opensource.org/licenses/MIT).
