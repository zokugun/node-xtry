import { type Result, type Failure, type Success } from './result.js';

export type YResult<T, E, S> = Failure<E> | YSuccess<T> | YFailure<S>;

export type YSuccess<T> = Success<T> & {
	success: true;
};

export type YFailure<S> = {
	fails: false;
	success: false;
	type: S;
	value: null;
	error: null;
};

export function yok<T>(value: T): YSuccess<T> {
	return {
		fails: false,
		success: true,
		value,
		error: null,
	};
}

export function yerr<S>(type: S): YFailure<S> {
	return {
		fails: false,
		success: false,
		type,
		value: null,
		error: null,
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

