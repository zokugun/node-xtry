import { type Failure, ok, type Result, type Success } from './result.js';
import { isPromiseLike } from './utils/is-promise-like.js';
import { type MaybePromise, type Callback, type NonPromiseCallback, type PromiseCallback } from './utils/types.js';

export type XDeferAsync<E> = {
	(): Promise<Success<void>>;
	<T>(result: Success<T>): Promise<Result<T, E>>;
	<F>(result: Failure<F>): Promise<Failure<F>>;
	<T, F>(result: Result<T, F>): Promise<Result<T, E | F>>;
};

export type XDeferSync<E> = {
	(): Success<void>;
	<T>(result: Success<T>): Result<T, E>;
	<F>(result: Failure<F>): Failure<F>;
	<T, F>(result: Result<T, F>): Result<T, E | F>;
};

/* eslint-disable @typescript-eslint/unified-signatures */
export function xdefer<E, Args extends unknown[]>(callback: NonPromiseCallback<Result<void, E>, Args>, thisArg?: object | null, ...args: Args): XDeferSync<E>;
export function xdefer<E, Args extends unknown[]>(callback: NonPromiseCallback<Result<unknown, E>, Args>, thisArg?: object | null, ...args: Args): XDeferSync<E>;
export function xdefer<E>(callback: Promise<Result<void, E>>): XDeferAsync<E>;
export function xdefer<E>(callback: Promise<Result<unknown, E>>): XDeferAsync<E>;
export function xdefer<E, Args extends unknown[]>(callback: (...args: Args) => Promise<Result<void, E>>, thisArg?: object | null, ...args: Args): XDeferAsync<E>;
export function xdefer<E, Args extends unknown[]>(callback: (...args: Args) => Promise<Result<unknown, E>>, thisArg?: object | null, ...args: Args): XDeferAsync<E>;
/* eslint-enable @typescript-eslint/unified-signatures */
export function xdefer<E, Args extends unknown[]>(callback: Callback<Result<unknown, E>, Args>, thisArg?: object | null, ...args: Args): XDeferSync<E> | XDeferAsync<E> {
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	return ((result?: Result<unknown, E>) => {
		const finalize = (deferResult: Result<unknown, E>): Result<unknown, E> | Success<void> => {
			if(deferResult.fails) {
				if((result)?.fails) {
					return result;
				}

				return deferResult;
			}

			return (result!) ?? ok();
		};

		let deferredValue: MaybePromise<Result<unknown, E>>;

		if(callback instanceof Function) {
			if(thisArg) {
				deferredValue = Reflect.apply(callback, thisArg, args) as MaybePromise<Result<unknown, E>>;
			}
			else {
				deferredValue = callback(...args);
			}
		}
		else {
			deferredValue = callback;
		}

		if(isPromiseLike(deferredValue)) {
			return Promise.resolve(deferredValue).then(finalize);
		}

		return finalize(deferredValue);
	}) as XDeferSync<E> | XDeferAsync<E>;
}

/* eslint-disable @typescript-eslint/unified-signatures */
export function xdeferAsync<E>(callback: Promise<Result<void, E>>): XDeferAsync<E>;
export function xdeferAsync<E>(callback: Promise<Result<unknown, E>>): XDeferAsync<E>;
export function xdeferAsync<E, Args extends unknown[]>(callback: (...args: Args) => Promise<Result<void, E>>, thisArg?: object | null, ...args: Args): XDeferAsync<E>;
export function xdeferAsync<E, Args extends unknown[]>(callback: (...args: Args) => Promise<Result<unknown, E>>, thisArg?: object | null, ...args: Args): XDeferAsync<E>;
/* eslint-enable @typescript-eslint/unified-signatures */
export function xdeferAsync<E, Args extends unknown[]>(callback: PromiseCallback<Result<unknown, E>, Args>, thisArg?: object | null, ...args: Args): XDeferAsync<E> {
	return (async (result?: Result<unknown, E>) => {
		let deferResult: Result<unknown, E>;

		if(callback instanceof Promise) {
			deferResult = await callback;
		}
		else if(thisArg) {
			deferResult = await callback.apply(thisArg, args);
		}
		else {
			deferResult = await callback(...args);
		}

		if(deferResult.fails) {
			if(result?.fails) {
				return result;
			}

			return deferResult;
		}

		return result ?? ok();
	}) as XDeferAsync<E>;
}

/* eslint-disable @typescript-eslint/unified-signatures */
export function xdeferSync<E>(callback: NonPromiseCallback<Result<void, E>>): XDeferSync<E>;
export function xdeferSync<E>(callback: NonPromiseCallback<Result<unknown, E>>): XDeferSync<E>;
export function xdeferSync<E, Args extends unknown[]>(callback: NonPromiseCallback<Result<void, E>, Args>, thisArg?: object | null, ...args: Args): XDeferSync<E>;
export function xdeferSync<E, Args extends unknown[]>(callback: NonPromiseCallback<Result<unknown, E>, Args>, thisArg?: object | null, ...args: Args): XDeferSync<E>;
/* eslint-enable @typescript-eslint/unified-signatures */
export function xdeferSync<E, Args extends unknown[]>(callback: NonPromiseCallback<Result<unknown, E>, Args>, thisArg?: object | null, ...args: Args): XDeferSync<E> {
	return ((result?: Result<unknown, E>) => {
		const deferResult = thisArg ? callback.apply(thisArg, args) : callback(...args);

		if(deferResult.fails) {
			if(result?.fails) {
				return result;
			}

			return deferResult;
		}

		return result ?? ok();
	}) as XDeferSync<E>;
}
