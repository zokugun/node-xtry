import { type Result, type Failure, type Success } from './result.js';
import { isPromiseLike } from './utils/is-promise-like.js';
import { type MaybePromise, type NotPromise } from './utils/types.js';

export type YResult<T, E, M> = Failure<E> | YSuccess<T> | YFailure<M>;

export type YSuccess<T> = Success<T> & {
	success: true;
};

export type YFailure<M> = {
	fails: false;
	success: false;
	miscue: M;
	value: undefined;
	error: undefined;
};

export function yok(): YSuccess<void>;
export function yok<T>(value: T): YSuccess<T>;
export function yok<T>(value?: T): YSuccess<T> {
	return {
		fails: false,
		success: true,
		value: value as T,
		error: undefined,
	};
}

export function yerr<M>(miscue: M): YFailure<M> {
	return {
		fails: false,
		success: false,
		miscue,
		value: undefined,
		error: undefined,
	};
}

type YRResult<T, E> = Failure<E> | YSuccess<T>;

export function yres<T, E>(result: NotPromise<Result<T, E>>): YRResult<T, E>;
export function yres<T, E>(result: Promise<Result<T, E>>): Promise<YRResult<T, E>>;
export function yres<T, E>(result: MaybePromise<Result<T, E>>): MaybePromise<YRResult<T, E>> {
	if(isPromiseLike(result)) {
		return result.then(yresSync);
	}

	return yresSync(result);
}

export function yresSync<T, E>(result: NotPromise<Result<T, E>>): YRResult<T, E> {
	if(result.fails) {
		return result;
	}

	return yep(result);
}

export async function yresAsync<T, E>(promise: Promise<Result<T, E>>): Promise<YRResult<T, E>> {
	return promise.then(yresSync);
}

export function yep<T>(result: Success<T>): YSuccess<T> {
	return {
		...result,
		success: true,
	};
}

export const YOK = Object.freeze(yok());
export const YOK_FALSE = Object.freeze(yok(false));
export const YOK_NULL = Object.freeze(yok(null));
export const YOK_TRUE = Object.freeze(yok(true));
export const YOK_UNDEFINED = Object.freeze(yok(undefined));
