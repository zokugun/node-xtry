import { err, ok, type Result } from './result.js';
import { isPromiseLike } from './utils/is-promise-like.js';
import { type Callback, type MaybePromise, type NonPromiseCallback, type PromiseCallback } from './utils/types.js';

type ErrorHandler<T> = (error: unknown) => T | undefined;
type VoidableResult<T, E> = E extends void ? Result<T, unknown> : Result<T, E>;

export function xtry<T, E = unknown>(func: NonPromiseCallback<T>, handler?: ErrorHandler<E>): VoidableResult<T, E>;
export function xtry<T, E = unknown>(func: PromiseCallback<T>, handler?: ErrorHandler<E>): Promise<VoidableResult<T, E>>;
export function xtry<T, E = unknown>(func: Callback<T>, handler?: ErrorHandler<E>): MaybePromise<VoidableResult<T, E>> {
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	const run = func instanceof Function ? func : () => func;

	const handleError = (error: unknown) => {
		if(handler) {
			const newError = handler(error);

			if(newError !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return err(newError) as any;
			}
		}

		return err(error);
	};

	const handleSuccess = (value: T) => ok(value);

	try {
		const value = run();

		if(isPromiseLike(value)) {
			return Promise.resolve(value).then(handleSuccess, handleError);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return handleError(error);
	}
}

export function xtrySync<T, E = unknown>(func: NonPromiseCallback<T>, handler?: ErrorHandler<E>): VoidableResult<T, E> {
	try {
		const value = func();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		if(handler) {
			const newError = handler(error);

			if(newError !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return err(newError) as any;
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return err(error as E) as any;
	}
}

export async function xtryAsync<T, E = unknown>(func: PromiseCallback<T>, handler?: ErrorHandler<E>): Promise<VoidableResult<T, E>> {
	try {
		const value = await (func instanceof Promise ? func : Promise.resolve().then(func));

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		if(handler) {
			const newError = handler(error);

			if(newError !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return err(newError) as any;
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return err(error as E) as any;
	}
}

