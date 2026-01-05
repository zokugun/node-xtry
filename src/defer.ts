import { ok, type Result, type Success } from './result.js';
import { isPromiseLike } from './utils/is-promise-like.js';
import { type Callback, type NonPromiseCallback, type PromiseCallback } from './utils/types.js';

type DeferAsync<E> = {
	(): Promise<Success<void>>;
	(result: UnknownResult<E>): Promise<UnknownResult<E>>;
};

type DeferSync<E> = {
	(): Success<void>;
	(result: UnknownResult<E>): UnknownResult<E>;
};

type UnknownResult<E> = Result<unknown, E>;

export function xdefer<E>(callback: NonPromiseCallback<UnknownResult<E>>): DeferSync<E>;
export function xdefer<E>(callback: PromiseCallback<UnknownResult<E>>): DeferAsync<E>;
export function xdefer<E>(callback: Callback<UnknownResult<E>>): DeferSync<E> | DeferAsync<E> {
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	return ((result?: UnknownResult<E>) => {
		const finalize = (deferResult: UnknownResult<E>): UnknownResult<E> => {
			if(deferResult.fails) {
				if(result?.fails) {
					return result;
				}

				return deferResult;
			}

			return result ?? ok();
		};

		const deferredValue = callback instanceof Function ? callback() : callback;

		if(isPromiseLike(deferredValue)) {
			return Promise.resolve(deferredValue).then(finalize);
		}

		return finalize(deferredValue);
	}) as DeferSync<E> | DeferAsync<E>;
}

export function xdeferAsync<E>(callback: PromiseCallback<UnknownResult<E>>): DeferAsync<E> {
	return (async (result?: UnknownResult<E>) => {
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

export function xdeferSync<E>(callback: NonPromiseCallback<UnknownResult<E>>): DeferSync<E> {
	return ((result?: UnknownResult<E>) => {
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
