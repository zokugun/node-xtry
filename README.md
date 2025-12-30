[@zokugun/xtry](https://github.com/zokugun/node-xtry)
==========================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@zokugun/xtry.svg?colorB=green)](https://www.npmjs.com/package/@zokugun/xtry)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

Simple `try/catch` wrappers that always return a `Result` discriminated union, plus ready-made helpers (`ok`, `err`) for predictable control flow.

Why xtry?
---------

- Turn any sync or async function into an explicit `Result` object with zero dependencies.
- Strong TypeScript types guide your control flow (`fails` and tagged errors).
- Optional failure handlers let you log, meter, or mutate state exactly where the error occurs.

Installation
------------

```bash
npm install @zokugun/xtry
```

Quick Start
-----------

```typescript
import { xatry } from '@zokugun/xtry'

const userResult = await xatry(fetchUserFromApi());

if(userResult.fails) {
    console.error(userResult.error);
    return;
}

console.log('User loaded:', userResult.value);
```

Advanced Example
----------------

```typescript
import { err, type Result, xatry, xtry } from '@zokugun/xtry'

export type FoobarError = { type: 'FOOBAR'; message: string };

async function foobar(): Result<number, FoobarError> {
    const result = await xatry(fetchUserFromApi());

    if(fails) {
        return err({ type: 'FOOBAR', message: 'The promise has failed...' });
    }

    return try(() => calculateAge(result.value));
}

async function main() {
    const result = await foobar();

    if(result.fails) {
        console.error(result.error.message);

        return;
    }

    console.log(result.value);
}
```

Partial Example
---------------

`YResult` extends the base `Result` union with a `success` flag so you can distinguish "valid failure" states from true errors.

```typescript
import { err, ok, yerr, yok, type YResult } from '@zokugun/xtry'

function toNumber(input: string): YResult<number, MyError, 'empty-string'> {
    if(input.length > 0) {
        return yerr('empty-string');
    }

    const floatValue = Number.parseFloat(input);

    if(Number.isNaN(floatValue)) {
        return err({ type: '#VALUE!' });
    }

    return yok(floatValue);
}

function add(_x: string, _y: number): Result<number, MyError> {
    const x = toNumber(_x);
    if(x.fails) {
        return x;
    }
    if(!x.success) {
        return ok(0);
    }

    const y = toNumber(_y);
    if(y.fails) {
        return y;
    }
    if(!y.success) {
        return ok(0);
    }

    return x.value + y.value;
}
```

API reference
-------------

### Result helpers

```typescript
type Success<T> = { fails: false; value: T; error: undefined };
type Failure<E> = { fails: true; value: undefined; error: E };
type Result<T, E> = Success<T> | Failure<E>;

function ok<T>(value: T): Success<T>;
function err<E>(error: E): Failure<E>;
```

### Try helpers

```typescript
function xtry<T, E>(func: () => Exclude<T, Promise<unknown>>, handler?: (error: unknown) => void | E): Result<T, E>;
function xatry<T, E>(func: (() => Exclude<T, Promise<unknown>>) | Promise<Exclude<T, Promise<unknown>>>, handler?: (error: unknown) => void | E): Promise<Result<T, E>>;

function stringifyError(error: unknown): string;
```

Both helpers:

- execute the supplied function and capture thrown values;
- call the optional `handler` before turning that value into `err(error)`;
- never throw, making the return signature a reliable discriminated union.

### Partial helpers

```typescript
type YSuccess<T> = Success<T> & { success: true };
type YFailure<M> = { fails: false; success: false; miscue: M; value: undefined; error: undefined };
type YResult<T, E, M> = Failure<E> | YSuccess<T> | YFailure<M>;

function yok<T>(value: T): YSuccess<T>;
function yerr<M>(type: M): YFailure<M>;
function yress<T, E>(result: Result<T, E>): Failure<E> | YSuccess<T>;
function yresa<T, E>(promise: Promise<Result<T, E>>): Promise<Failure<E> | YSuccess<T>>;
function yep<T>(result: Success<T>): YSuccess<T>;
```

These helpers are useful when you need to separate soft rejections (`success: false`) from hard failures (`fails: true`).

Tips
----

- Narrow on `fails` first, then use other flags (`success`, custom `type` or `value`) for the happy-path branching.

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
