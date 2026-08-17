import type { Failure, Result, Success } from './result.js';
import type { MaybePromise, NotPromise } from './utils/types.js';

import { isPromiseLike } from './utils/is-promise-like.js';

export type YFailure<M> = {
	error: undefined;
	fails: false;
	miscue: M;
	success: false;
	value: undefined;
};

export type YResult<T, E, M> = Failure<E> | YFailure<M> | YSuccess<T>;

export type YSuccess<T> = {
	success: true;
} & Success<T>;

type YRResult<T, E> = Failure<E> | YSuccess<T>;

export function yep<T>(result: Success<T>): YSuccess<T> {
	return {
		...result,
		success: true,
	};
}
export function yerr<M>(miscue: M): YFailure<M> {
	return {
		error: undefined,
		fails: false,
		miscue,
		success: false,
		value: undefined,
	};
}

export function yok(): YSuccess<void>;
export function yok<T>(value: T): YSuccess<T>;
export function yok<T>(value?: T): YSuccess<T> {
	return {
		error: undefined,
		fails: false,
		success: true,
		// eslint-disable-next-line ts/no-unsafe-type-assertion
		value: value as T,
	};
}
export function yres<T, E>(result: NotPromise<Result<T, E>>): YRResult<T, E>;
export function yres<T, E>(result: Promise<Result<T, E>>): Promise<YRResult<T, E>>;
export function yres<T, E>(result: MaybePromise<Result<T, E>>): MaybePromise<YRResult<T, E>> {
	if(isPromiseLike(result)) {
		return result.then(yresSync);
	}

	return yresSync(result);
}

export async function yresAsync<T, E>(promise: Promise<Result<T, E>>): Promise<YRResult<T, E>> {
	return promise.then(yresSync);
}

export function yresSync<T, E>(result: NotPromise<Result<T, E>>): YRResult<T, E> {
	if(result.fails) {
		return result;
	}

	return yep(result);
}

export const YOK = Object.freeze(yok());
export const YOK_FALSE = Object.freeze(yok(false));
export const YOK_NULL = Object.freeze(yok(null));
export const YOK_TRUE = Object.freeze(yok(true));
export const YOK_UNDEFINED = Object.freeze(yok(undefined));
