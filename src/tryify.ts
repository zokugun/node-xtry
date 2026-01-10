import { type Result } from './result.js';
import { xtryAsync, xtryAsyncIterable, xtrySync, xtrySyncIterable } from './try.js';
import { type NotPromise } from './utils/types.js';

export type AsyncIteratorElement<T> =
	T extends Promise<infer P> ? AsyncIteratorElement<P> :
		T extends AsyncIterator<infer E> ? E :
			T extends AsyncIterable<infer E> ? E :
				T extends { [Symbol.asyncIterator]: (...args: unknown[]) => infer I } ? AsyncIteratorElement<I> :
					unknown;
export type SyncIteratorElement<T> =
	T extends Iterator<infer E> ? E :
		T extends Iterable<infer E> ? E :
			T extends { [Symbol.iterator]: (...args: unknown[]) => infer I } ? SyncIteratorElement<I> :
				unknown;

export type AsyncResult<T extends (...args: unknown[]) => unknown, Err extends Error> = Promise<Result<Awaited<ReturnType<T>>, Err>>;
export type AsyncIteratableResult<T extends (...args: unknown[]) => unknown, Err extends Error> = AsyncIterable<Result<AsyncIteratorElement<ReturnType<T>>, Err>, unknown, unknown>;

export type SyncResult<T extends (...args: unknown[]) => NotPromise<unknown>, Err extends Error> = Result<ReturnType<T>, Err>;
export type SyncIteratableResult<T extends (...args: unknown[]) => unknown, Err extends Error> = Iterable<Result<SyncIteratorElement<ReturnType<T>>, Err>, unknown, unknown>;

export function xtryifyAsync<Fn extends (...args: unknown[]) => Promise<unknown>, Err extends Error>(fn: Fn) {
	return async function (...args: Parameters<Fn>): AsyncResult<Fn, Err> {
		return xtryAsync(fn(...args)) as AsyncResult<Fn, Err>;
	};
}

export function xtryifyAsyncIterable<Fn extends (...args: unknown[]) => AsyncIterable<unknown>, Err extends Error>(fn: Fn) {
	return function (...args: Parameters<Fn>): AsyncIteratableResult<Fn, Err> {
		return xtryAsyncIterable(fn(...args)) as AsyncIteratableResult<Fn, Err>;
	};
}

export function xtryifySync<Fn extends (...args: unknown[]) => NotPromise<unknown>, Err extends Error>(fn: Fn) {
	return function (...args: Parameters<Fn>): SyncResult<Fn, Err> {
		return xtrySync(() => fn(...args)) as SyncResult<Fn, Err>;
	};
}

export function xtryifySyncIterable<Fn extends (...args: unknown[]) => Iterable<unknown>, Err extends Error>(fn: Fn) {
	return function (...args: Parameters<Fn>): SyncIteratableResult<Fn, Err> {
		return xtrySyncIterable(fn(...args)) as SyncIteratableResult<Fn, Err>;
	};
}
