[@zokugun/xtry](https://github.com/zokugun/node-xtry)
==========================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@zokugun/xtry.svg?colorB=green)](https://www.npmjs.com/package/@zokugun/xtry)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

Simple `try/catch` wrappers that always return a `Result` discriminated union, plus ready-made helpers (`ok`, `err`) for predictable control flow.

Why `@zokugun/xtry`?
--------------------

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
import { xtry } from '@zokugun/xtry'

const userResult = await xtry(fetchUserFromApi());

if(userResult.fails) {
    console.error(userResult.error);
    return;
}

console.log('User loaded:', userResult.value);
```

Advanced Example
----------------

```typescript
import { err, type Result, xtry } from '@zokugun/xtry'

export type FoobarError = { type: 'FOOBAR'; message: string };

async function foobar(): Result<number, FoobarError> {
    const result = await xtry(fetchUserFromApi());

    if(fails) {
        return err({ type: 'FOOBAR', message: 'The promise has failed...' });
    }

    return xtry(() => calculateAge(result.value));
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

Tips
----

- Narrow on `fails` first, then use other flags (`success`, custom `miscue` or `value`) for the happy-path branching.

API reference
-------------

### Result helpers

```typescript
type Success<T> = { fails: false; value: T; error: undefined };
type Failure<E> = { fails: true; value: undefined; error: E };
type Result<T, E> = Success<T> | Failure<E>;

function ok<T>(value?: T): Success<T>;
function err<E>(error: E): Failure<E>;
```

#### Pre-built `ok` constants

To minimize allocations when returning the same `Success` shape, you can reuse the exported frozen helpers:

| Constant       | Wrapped value   | Type                 | Typical usage                                          |
| -------------- | --------------- | -------------------- | ------------------------------------------------------ |
| `OK`           | `ok()`          | `Success<void>`      | Generic void success (e.g., cleanup, notifications)    |
| `OK_NULL`      | `ok(null)`      | `Success<null>`      | APIs that explicitly signal "nothing" with `null`      |
| `OK_UNDEFINED` | `ok(undefined)` | `Success<undefined>` | APIs that explicitly signal "nothing" with `undefined` |
| `OK_TRUE`      | `ok(true)`      | `Success<true>`      | Flag-style functions (`enable()` / `disable()`)        |
| `OK_FALSE`     | `ok(false)`     | `Success<false>`     | Guard checks that succeed with `false`                 |

### Try helpers

```
function xtry<T, E>(func: (() => MaybePromise<T>) | Promise<T>, handler?: (error: unknown) => void | E): MaybePromise<Result<T, E>>;
function xtry<T, E>(iterable: (() => Iterable<T>) | Iterable<T>, handler?: (error: unknown) => void | E): Iterable<Result<T, E>>;
function xtry<T, E>(iterable: (() => AsyncIterable<T>) | AsyncIterable<T>, handler?: (error: unknown) => void | E): AsyncIterable<Result<T, E>>;
function xtryAsync<T, E>(func: (() => Promise<T>) | Promise<T>, handler?: (error: unknown) => void | E): Promise<Result<T, E>>;
function xtryAsyncIterable<T, E>(iterable: (() => MaybePromise<AsyncIterable<T>>) | MaybePromise<AsyncIterable<T>>, handler?: (error: unknown) => void | E): AsyncIterable<Result<T, E>>;
function xtrySync<T, E>(func: () => Exclude<T, Promise<unknown>>, handler?: (error: unknown) => void | E): Result<T, E>;
function xtrySyncIterable<T, E>(iterable: (() => Iterable<T>) | Iterable<T>, handler?: (error: unknown) => void | E): Iterable<Result<T, E>>;
(error: unknown) => void | E): AsyncIterable<Result<T, E>>;

function stringifyError(error: unknown): string;
```

`xtry` inspects the supplied value and chooses the matching shape:

- promises or async factories → `Promise<Result<…>>`
- async iterables → `AsyncIterable<Result<…>>`
- iterators/generators → `Iterable<Result<…>>`
- everything else → plain `Result<…>`

Wrap default collections (arrays, sets, maps, strings, typed arrays, …) inside a function if you need them treated as raw values instead of iterables.<br />
Reach for `xtrySync`/`xtryAsync` when you want to force a specific mode, and prefer the explicit `xtrySyncIterable`/`xtryAsyncIterable` exports whenever you always expect iterable outputs.<br />
`xtryIterable` and `xtryAsyncIterable` wrap synchronous or asynchronous iterables, yielding a stream of `Result` values and emitting a single `err(...)` before stopping when the underlying iterator throws or rejects.

All helpers:

- execute the supplied function and capture thrown values;
- call the optional `handler` before turning that value into `err(error)`;

### xtryify helpers

`xtryify*` helpers turn any function into a reusable wrapper that always yields a `Result`, saving you from retyping `xtry(…)` every time you call it.

```typescript
import { xtryifyAsync, xtryifySync } from '@zokugun/xtry'

const fetchUserSafely = xtryifyAsync((id: string) => fetch(`/users/${id}`).then(r => r.json()));
const parseConfig = xtryifySync(() => JSON.parse(readFileSync('config.json', 'utf8')));

const userResult = await fetchUserSafely('42');
const configResult = parseConfig();
```

Available variants mirror the regular helpers:

- `xtryifySync(fn)` and `xtryifyAsync(fn)` return new functions that forward arguments to `fn` and capture thrown/errors as `Result` objects.
- `xtryifySyncIterable(fn)` and `xtryifyAsyncIterable(fn)` wrap functions that return iterables/async iterables, yielding streams of `Result` values.

Because the returned function already encapsulates the try/catch logic, you can share it across modules (e.g., inject into DI containers or export once for common utilities) while keeping strong `Result` typing for every call site.

### Partial helpers

```typescript
type YSuccess<T> = Success<T> & { success: true };
type YFailure<M> = { fails: false; success: false; miscue: M; value: undefined; error: undefined };
type YResult<T, E, M> = Failure<E> | YSuccess<T> | YFailure<M>;

function yok<T>(value: T): YSuccess<T>;
function yerr<M>(type: M): YFailure<M>;
function yres<T, E>(result: MaybePromise<Result<T, E>>): MaybePromise<Failure<E> | YSuccess<T>>;
function yresSync<T, E>(result: Result<T, E>): Failure<E> | YSuccess<T>;
function yresAsync<T, E>(promise: Promise<Result<T, E>>): Promise<Failure<E> | YSuccess<T>>;
function yep<T>(result: Success<T>): YSuccess<T>;
```

These helpers are useful when you need to separate soft rejections (`success: false`) from hard failures (`fails: true`).

### Defer helpers

```typescript
type DeferSync<E> = (result?: Result<unknown, E>) => Result<unknown, E> | Success<void>;
type DeferAsync<E> = (result?: Result<unknown, E>) => Promise<Result<unknown, E> | Success<void>>;

function xdefer<E>(callback: () => Result<unknown, E> | Promise<Result<unknown, E>>): DeferSync<E> | DeferAsync<E>;
function xdeferSync<E>(callback: () => Result<unknown, E>): DeferSync<E>;
function xdeferAsync<E>(callback: (() => Promise<Result<unknown, E>>) | Promise<Result<unknown, E>>): DeferAsync<E>;
```

Use these helpers to express "finally" logic that can also fail while preserving the original result when needed:

```typescript
import { stringifyError, xdefer, xtry } from '@zokugun/xtry/async'

function test(): Result<void, string> {
    const closeConnection = xdefer(xtry(connection.close()));

    const queryResult = await xtry(connection.query('SELECT 1'));

    if(queryResult.fails) {
        return closeConnection(err(stringifyError(queryResult.error)))
    }

    ...

    return closeConnection();
}
```

- `xdefer` inspects the callback result: if it fails, it becomes the returned error unless the main result already failed.
- Passing a promise (or async factory) makes the defer helper async-aware; `xdeferSync`/`xdeferAsync` let you pin the behavior explicitly for bundlers.
- Calling the returned function with no arguments just runs the deferred work and yields `ok()`.

Module entry points
-------------------

Choose the entry point that matches your environment and naming preferences:

| Import path           | Description                 | `xtry` name                     | `xdefer` name                         | Extra alias                     |
| --------------------- | --------------------------- | ------------------------------- | ------------------------------------- | ------------------------------- |
| `@zokugun/xtry`       | Both sync, async and hybrid | `xtry`, `xtryAsync`, `xtrySync` | `xdefer`, `xdeferAsync`, `xdeferSync` | `yres`, `yresAsync`, `yresSync` |
| `@zokugun/xtry/async` | Async-only                 | `xtryAsync` as `xtry`           | `xdeferAsync` as `xdefer`             | `yresAsync`  as `yres`          |
| `@zokugun/xtry/sync`  | Synchronous-only            | `xtrySync` as `xtry`            | `xdeferSync` as `xdefer`              | `yresSync` as `yres`            |

All modules share the same `Result`, `Partial`, and `stringifyError` exports, so you can swap entry points without refactoring types.

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
