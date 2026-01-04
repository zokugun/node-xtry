import { type Result, type Failure, type Success } from './result.js';

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

export function yress<T, E>(result: Result<T, E>): Failure<E> | YSuccess<T> {
	if(result.fails) {
		return result;
	}

	return yep(result);
}

export async function yresa<T, E>(promise: Promise<Result<T, E>>): Promise<Failure<E> | YSuccess<T>> {
	return promise.then(yress);
}

export function yep<T>(result: Success<T>): YSuccess<T> {
	return {
		...result,
		success: true,
	};
}

export const YOK = Object.freeze(yok());
export const YOK_NULL = Object.freeze(yok(null));
export const YOK_TRUE = Object.freeze(yok(true));
export const YOK_FALSE = Object.freeze(yok(false));
