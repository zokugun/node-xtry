import { type Result } from './result.js';
import { xtryAsync, xtryAsyncIterable, xtrySync, xtrySyncIterable } from './try.js';
import { type NotPromise } from './utils/types.js';

type AnyAsyncFunction = (...args: any[]) => Promise<unknown>;
type AnySyncFunction = (...args: any[]) => unknown;

type LastIsFunction<T extends readonly any[]> =
	T extends [...infer Rest, infer Last]
		? Last extends (...args: any[]) => any
			? true
			: false
		: false;

type OverloadsUnion<Fn extends Function> = Fn extends {
	(...args: infer A1): infer R1;
	(...args: infer A2): infer R2;
	(...args: infer A3): infer R3;
	(...args: infer A4): infer R4;
	(...args: infer A5): infer R5;
	(...args: infer A6): infer R6;
	(...args: infer A7): infer R7;
	(...args: infer A8): infer R8;
	(...args: infer A9): infer R9;
	(...args: infer A10): infer R10;
}
	? ((...args: A1) => R1)
	| ((...args: A2) => R2)
	| ((...args: A3) => R3)
	| ((...args: A4) => R4)
	| ((...args: A5) => R5)
	| ((...args: A6) => R6)
	| ((...args: A7) => R7)
	| ((...args: A8) => R8)
	| ((...args: A9) => R9)
	| ((...args: A10) => R10)
	: Fn;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type WrapAsyncOverload<Fn extends AnyAsyncFunction, Err extends Error> = Fn extends (...args: infer Args) => unknown
	? (...args: Args) => AsyncFunctionResult<Fn, Err>
	: never;

type WrapAsyncIterableOverload<Fn extends AsyncIterableFunction, Err extends Error> = Fn extends (...args: infer Args) => AsyncIterable<unknown>
	? (...args: Args) => AsyncIteratableFunctionResult<Fn, Err>
	: never;

type WrapSyncOverload<Fn extends AnySyncFunction, Err extends Error> = Fn extends (...args: infer Args) => unknown
	? (...args: Args) => SyncFunctionResult<Fn, Err>
	: never;

type WrapSyncIterableOverload<Fn extends SyncIterableFunction, Err extends Error> = Fn extends (...args: infer Args) => Iterable<unknown>
	? (...args: Args) => SyncIteratableFunctionResult<Fn, Err>
	: never;

export type AsyncFunction<Fn extends (...args: any[]) => any> =	ReturnType<Fn> extends Promise<any>
	? Fn
	: never;

export type AsyncIterableFunction = (...args: any[]) => AsyncIterable<unknown>;

export type AsyncIteratorElement<T> =
	T extends Promise<infer P> ? AsyncIteratorElement<P> :
		T extends AsyncIterator<infer E> ? E :
			T extends AsyncIterable<infer E> ? E :
				T extends { [Symbol.asyncIterator]: (...args: unknown[]) => infer I } ? AsyncIteratorElement<I> :
					unknown;

export type AsyncFunctionResult<T extends (...args: unknown[]) => unknown, Err extends Error> = Promise<Result<Awaited<ReturnType<T>>, Err>>;
export type AsyncIteratableFunctionResult<T extends (...args: unknown[]) => unknown, Err extends Error> = AsyncIterable<Result<AsyncIteratorElement<ReturnType<T>>, Err>, unknown, unknown>;

export type PreserveAsyncOverloads<Fn extends AnyAsyncFunction, Err extends Error> = UnionToIntersection<WrapAsyncOverload<OverloadsUnion<Fn>, Err>>;
export type PreserveAsyncIterableOverloads<Fn extends AsyncIterableFunction, Err extends Error> = UnionToIntersection<WrapAsyncIterableOverload<OverloadsUnion<Fn>, Err>>;

export type PreserveSyncOverloads<Fn extends AnySyncFunction, Err extends Error> = UnionToIntersection<WrapSyncOverload<OverloadsUnion<Fn>, Err>>;
export type PreserveSyncIterableOverloads<Fn extends SyncIterableFunction, Err extends Error> = UnionToIntersection<WrapSyncIterableOverload<OverloadsUnion<Fn>, Err>>;

export type SyncFunction<Fn extends (...args: any[]) => any> =
	LastIsFunction<Parameters<Fn>> extends true
		? never
		: ReturnType<Fn> extends Promise<any>
			? never
			: Fn;

export type SyncIterableFunction = (...args: any[]) => Iterable<unknown>;

export type SyncIteratorElement<T> =
	T extends Iterator<infer E> ? E :
		T extends Iterable<infer E> ? E :
			T extends { [Symbol.iterator]: (...args: unknown[]) => infer I } ? SyncIteratorElement<I> :
				unknown;

export type SyncFunctionResult<T extends (...args: unknown[]) => NotPromise<unknown>, Err extends Error> = Result<ReturnType<T>, Err>;
export type SyncIteratableFunctionResult<T extends (...args: unknown[]) => unknown, Err extends Error> = Iterable<Result<SyncIteratorElement<ReturnType<T>>, Err>, unknown, unknown>;

export function xtryifyAsync<Err extends Error, Fn extends AnyAsyncFunction = any>(fn: AsyncFunction<Fn>): PreserveAsyncOverloads<Fn, Err> {
	return async function (...args: Parameters<Fn>): AsyncFunctionResult<Fn, Err> {
		return xtryAsync(async () => fn(...args)) as AsyncFunctionResult<Fn, Err>;
	} as PreserveAsyncOverloads<Fn, Err>;
}

export function xtryifyAsyncIterable<Err extends Error, Fn extends AsyncIterableFunction = any>(fn: Fn): PreserveAsyncIterableOverloads<Fn, Err> {
	return function (...args: Parameters<Fn>): AsyncIteratableFunctionResult<Fn, Err> {
		return xtryAsyncIterable(fn(...args)) as AsyncIteratableFunctionResult<Fn, Err>;
	} as PreserveAsyncIterableOverloads<Fn, Err>;
}

export function xtryifySync<Err extends Error, Fn extends AnySyncFunction = any>(fn: SyncFunction<Fn>): PreserveSyncOverloads<Fn, Err> {
	return function (...args: Parameters<Fn>): SyncFunctionResult<Fn, Err> {
		return xtrySync(() => fn(...args)) as SyncFunctionResult<Fn, Err>;
	} as PreserveSyncOverloads<Fn, Err>;
}

export function xtryifySyncIterable<Err extends Error, Fn extends SyncIterableFunction = any>(fn: Fn): PreserveSyncIterableOverloads<Fn, Err> {
	return function (...args: Parameters<Fn>): SyncIteratableFunctionResult<Fn, Err> {
		return xtrySyncIterable(fn(...args)) as SyncIteratableFunctionResult<Fn, Err>;
	} as PreserveSyncIterableOverloads<Fn, Err>;
}
