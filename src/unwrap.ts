import type { Result } from './result.js';

import { ok } from './result.js';
import { stringifyError } from './stringify-error.js';

export function map<T, E, U>(result: Result<T, E>, transform: (value: T) => U): Result<U, E> {
	if(result.fails) {
		return result;
	}
	else {
		return ok(transform(result.value));
	}
}

export function match<T, E, R>(result: Result<T, E>, handlers: { failure: (error: E) => R; success: (value: T) => R }): R {
	if(result.fails) {
		return handlers.failure(result.error);
	}
	else {
		return handlers.success(result.value);
	}
}

export function unwrap<T, E>(result: Result<T, E>): T {
	if(result.fails) {
		if(result.error instanceof Error) {
			throw result.error;
		}
		else {
			throw new Error(stringifyError(result.error));
		}
	}

	return result.value;
}

export function unwrapOr<T, E, F>(result: Result<T, E>,	fallback: F): F | T {
	if(result.fails) {
		return fallback;
	}
	else {
		return result.value;
	}
}
