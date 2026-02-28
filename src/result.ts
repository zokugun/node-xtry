export type Success<T> = {
	fails: false;
	value: T;
	error: undefined;
};

export type Failure<E> = {
	fails: true;
	value: undefined;
	error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;
export type AsyncResult<T, E> = Promise<Result<T, E>>;
export type DResult<T = void, E = string> = Result<T, E>;
export type AsyncDResult<T = void, E = string> = AsyncResult<T, E>;

export function ok(): Success<void>;
export function ok<T>(value: T): Success<T>;
export function ok<T>(value?: T): Success<T> {
	return {
		fails: false,
		value: value as T,
		error: undefined,
	};
}

export function err<E>(error: E): Failure<E> {
	return {
		fails: true,
		value: undefined,
		error,
	};
}

export const OK = Object.freeze(ok());
export const OK_FALSE = Object.freeze(ok(false));
export const OK_NULL = Object.freeze(ok(null));
export const OK_TRUE = Object.freeze(ok(true));
export const OK_UNDEFINED = Object.freeze(ok(undefined));
