import { type Failure, ok, type Result, type Success } from './result.js';
import { isPromiseLike } from './utils/is-promise-like.js';
import { type Callback, type NonPromiseCallback, type PromiseCallback } from './utils/types.js';

type DeferAsync<E> = {
	(): Promise<Success<void>>;
	<T>(result: Success<T>): Promise<Result<T, E>>;
	<F>(result: Failure<F>): Promise<Failure<F>>;
	<T, F>(result: Result<T, F>): Promise<Result<T, E | F>>;
};

type DeferSync<E> = {
	(): Success<void>;
	<T>(result: Success<T>): Result<T, E>;
	<F>(result: Failure<F>): Failure<F>;
	<T, F>(result: Result<T, F>): Result<T, E | F>;
};

export function xdefer<E>(callback: NonPromiseCallback<Result<unknown, E>>): DeferSync<E>;
export function xdefer<E>(callback: PromiseCallback<Result<unknown, E>>): DeferAsync<E>;
export function xdefer<E>(callback: Callback<Result<unknown, E>>): DeferSync<E> | DeferAsync<E> {
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

		const deferredValue = callback instanceof Function ? callback() : callback;

		if(isPromiseLike(deferredValue)) {
			return Promise.resolve(deferredValue).then(finalize);
		}

		return finalize(deferredValue);
	}) as DeferSync<E> | DeferAsync<E>;
}

export function xdeferAsync<E>(callback: PromiseCallback<Result<unknown, E>>): DeferAsync<E> {
	return (async (result?: Result<unknown, E>) => {
		const deferResult = await (callback instanceof Promise ? callback : callback());

		if(deferResult.fails) {
			if(result?.fails) {
				return result;
			}

			return deferResult;
		}

		return result ?? ok();
	}) as DeferAsync<E>;
}

export function xdeferSync<E>(callback: NonPromiseCallback<Result<unknown, E>>): DeferSync<E> {
	return ((result?: Result<unknown, E>) => {
		const deferResult = callback();

		if(deferResult.fails) {
			if(result?.fails) {
				return result;
			}

			return deferResult;
		}

		return result ?? ok();
	}) as DeferSync<E>;
}
