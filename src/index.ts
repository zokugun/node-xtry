type Success<T> = {
	fails: false;
	value: T;
	error: null;
};

type Failure<E> = {
	fails: true;
	value: null;
	error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export function xtry<T, E>(
	func: () => Exclude<T, Promise<unknown>>,
	handler?: ((error: E) => void),
): Result<T, E> {
	try {
		const value = func();

		return ok(value);
	}
	catch (error) {
		if(handler) {
			handler(error as E);
		}

		return err(error as E);
	}
}

export async function xatry<T, E>(
	func: (() => Exclude<T, Promise<unknown>>) | Promise<Exclude<T, Promise<unknown>>>,
	handler?: ((error: E) => void),
): Promise<Result<T, E>> {
	try {
		const value = await (func instanceof Promise ? func : Promise.resolve().then(func));

		return ok(value);
	}
	catch (error) {
		if(handler) {
			handler(error as E);
		}

		return err(error as E);
	}
}

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
