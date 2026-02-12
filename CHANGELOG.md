# Changelog

## v0.10.1 | 2026-02-12
- update dev dependencies

## v0.10.0 | 2026-01-14
- in `xtryify`, move error type first so it can be specified

## v0.9.1 | 2026-01-12
- export all types to help to build a cohesive `xtryify`

## v0.9.0 | 2026-01-12
- add `OK_UNDEFINED` prebuilt
- improve `xtryify` so it preserves the typing of the given function even if it's an overloaded function
- xtryify `JSON.parse` as `parseJson`
- expose modules `result` and `json`

## v0.8.0 | 2026-01-10
- add `xtryifySync`, `xtryifyAsync`, `xtryifySyncIterable` and `xtryifyAsyncIterable` helpers

## v0.7.2 | 2026-01-09
- add `bind` and `...args` to `xdefer`

## v0.7.1 | 2026-01-09
- fix `toStringFailure` to take a `Failure<unknown>`

## v0.7.0 | 2026-01-09
- add `trySyncIterable` and `tryAsyncIterable` to support itearables
- add `toStringFailure` helper
- `async` and `sync` are exporting all functions

## v0.6.4 | 2026-01-08
- use `tsc-leda` to generate CJS and ESM files
- fix `xdefer` typing

## v0.6.3 | 2026-01-06
- incorporate all required files into the published package

## v0.6.2 | 2026-01-06
- use `tsdown` to generate CJS and ESM files

## v0.6.1 | 2026-01-06
- publish `.cjs` files

## v0.6.0 | 2026-01-06
- generate `.cjs` files

## v0.5.0 | 2026-01-06
- add `xdefer` (hybrid, async and sync functions)
- add hybrid function for `xtry` and `yres`
- add frozen `OK` values
- allow empty `yok()`

## v0.4.1 | 2025-12-31
- allow empty `ok()`

## v0.4.0 | 2025-12-30
- add `yep` and `yres` helpers
- rename partial's error to `miscue`
- use `undefined` instead of `null`

## v0.3.0 | 2025-12-20
- `xtry`'s error handler can transform error
- add `stringifyError` helper

## v0.2.0 | 2025-12-19
- add partial helpers

## v0.1.0 | 2025-03-23
- initial release
