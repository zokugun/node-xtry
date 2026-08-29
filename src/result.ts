export type AsyncDResult<T = void, E = string> = AsyncResult<T, E>;

export type AsyncResult<T, E> = Promise<Result<T, E>>;

export type DResult<T = void, E = string> = Result<T, E>;

export type Failure<E> = {
	error: E;
	fails: true;
	value: undefined;
};

export type Result<T, E> = Failure<E> | Success<T>;

export type Success<T> = {
	error: undefined;
	fails: false;
	value: T;
};

export function err<E>(error: E): Failure<E> {
	return {
		error,
		fails: true,
		value: undefined,
	};
}

export function ok(): Success<void>;
export function ok<T>(value: T): Success<T>;
export function ok<T>(value?: T): Success<T> {
	return {
		error: undefined,
		fails: false,

		value: value as T,
	};
}

export const OK = Object.freeze(ok());
export const OK_FALSE = Object.freeze(ok(false));
export const OK_NULL = Object.freeze(ok(null));
export const OK_TRUE = Object.freeze(ok(true));
export const OK_UNDEFINED = Object.freeze(ok(undefined));
