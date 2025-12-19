export type Success<T> = {
	fails: false;
	value: T;
	error: null;
};

export type Failure<E> = {
	fails: true;
	value: null;
	error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export function ok<T>(value: T): Success<T> {
	return {
		fails: false,
		value,
		error: null,
	};
}

export function err<E>(error: E): Failure<E> {
	return {
		fails: true,
		value: null,
		error,
	};
}

