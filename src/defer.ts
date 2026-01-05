import { ok, type Result, type Success } from './result.js';
import { isPromiseLike } from './utils/is-promise-like.js';

type AnyResult<E> = Result<unknown, E>;
type MaybeDeferred<T> = PromiseLike<T> | (() => PromiseLike<T>) | (() => T);

type DeferSync<E> = {
	(): Success<void>;
	<R extends AnyResult<E>>(result: R): R;
};

type DeferAsync<E> = {
	(): Promise<Success<void>>;
	<R extends AnyResult<E>>(result: R): Promise<R>;
};

export function xdefer<E, D extends Result<unknown, E>>(callback: () => D): DeferSync<E>;
export function xdefer<E, D extends Result<unknown, E>>(callback: (() => PromiseLike<D>) | PromiseLike<D>): DeferAsync<E>;
export function xdefer<E, D extends Result<unknown, E>>(callback: MaybeDeferred<D>): DeferSync<E> | DeferAsync<E> {
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	return (<R extends AnyResult<E>>(result?: R) => {
		const finalize = (deferResult: D): R | Success<void> => {
			if(deferResult.fails) {
				if(result?.fails) {
					return result;
				}

				return deferResult as unknown as R;
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

export function xdeferAsync<E, D extends Result<unknown, E>>(callback: Promise<D> | (() => Promise<D>)): DeferAsync<E> {
	return (async <R extends AnyResult<E>>(result?: R) => {
		const deferResult = await (callback instanceof Promise ? callback : callback());

		if(deferResult.fails) {
			if(result?.fails) {
				return result;
			}

			return deferResult as unknown as R;
		}

		return result ?? ok();
	}) as DeferAsync<E>;
}

export function xdeferSync<E, D extends Result<unknown, E>>(callback: () => D): DeferSync<E> {
	return (<R extends AnyResult<E>>(result?: R) => {
		const deferResult = callback();

		if(deferResult.fails) {
			if(result?.fails) {
				return result;
			}

			return deferResult as unknown as R;
		}

		return result ?? ok();
	}) as DeferSync<E>;
}
