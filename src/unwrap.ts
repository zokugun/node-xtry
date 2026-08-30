import type { Result } from './result.js';

import { ok } from './result.js';
import { stringifyError } from './stringify-error.js';

type LimitedResult<T, E> = { error: E; fails: true } | { fails: false; value: T };

export function map<T, E, U>(result: LimitedResult<T, E>, transform: (value: T) => U): Result<U, E> {
	if(result.fails) {
		return result as Result<U, E>;
	}
	else {
		return ok(transform(result.value));
	}
}

export function match<T, E, R>(result: LimitedResult<T, E>, handlers: { failure: (error: E) => R; success: (value: T) => R }): R {
	if(result.fails) {
		return handlers.failure(result.error);
	}
	else {
		return handlers.success(result.value);
	}
}

export function unwrap<T, E>(result: LimitedResult<T, E>, transform?: (error: E) => Error): T {
	if(result.fails) {
		if(transform) {
			throw transform(result.error);
		}
		else if(result.error instanceof Error) {
			throw result.error;
		}
		else {
			throw new Error(stringifyError(result.error));
		}
	}

	return result.value;
}

export function unwrapOr<T, E, F>(result: LimitedResult<T, E>,	fallback: F): F | T {
	if(result.fails) {
		return fallback;
	}
	else {
		return result.value;
	}
}
