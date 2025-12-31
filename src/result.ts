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
