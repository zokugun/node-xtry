import { err, ok, type Result } from './result.js';
import { isAsyncIterable } from './utils/is-async-iterable.js';
import { isPromiseLike } from './utils/is-promise-like.js';
import { isSyncIterable } from './utils/is-sync-iterable.js';
import { type Callback, type MaybePromise, type NonPromiseCallback, type PromiseCallback } from './utils/types.js';

type AsyncIterableCallback<T> = (() => AsyncIterable<T>) | AsyncIterable<T>;
type AsyncIterableResult<T, E> = AsyncIterable<VoidableResult<T, E>>;
type ErrorHandler<T> = (error: unknown) => T | undefined;
type SyncIterableCallback<T> = (() => Iterable<T>) | Iterable<T>;
type SyncIterableResult<T, E> = Iterable<VoidableResult<T, E>>;
type VoidableResult<T, E> = E extends void ? Result<T, unknown> : Result<T, E>;

function handleError<T, E>(handler: ErrorHandler<E> | undefined, error: unknown): VoidableResult<T, E> { // {{{
	if(handler) {
		const newError = handler(error);

		if(newError !== undefined) {
			return err(newError) as VoidableResult<T, E>;
		}
	}

	return err(error) as VoidableResult<T, E>;
} // }}}

export function xtry<T, E = unknown>(iterable: SyncIterableCallback<T>, handler?: ErrorHandler<E>): SyncIterableResult<T, E>;
export function xtry<T, E = unknown>(iterable: AsyncIterableCallback<T>, handler?: ErrorHandler<E>): AsyncIterableResult<T, E>;
export function xtry<T, E = unknown>(func: NonPromiseCallback<T>, handler?: ErrorHandler<E>): VoidableResult<T, E>;
export function xtry<T, E = unknown>(func: PromiseCallback<T>, handler?: ErrorHandler<E>): Promise<VoidableResult<T, E>>;
export function xtry<T, E = unknown>(func: Callback<T> | SyncIterableCallback<T> | AsyncIterableCallback<T>, handler?: ErrorHandler<E>): MaybePromise<VoidableResult<T, E>> | SyncIterableResult<T, E> | AsyncIterableResult<T, E> { // {{{
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	const run = func instanceof Function ? func : () => func;

	try {
		const value = run();

		if(isPromiseLike(value as MaybePromise<T>)) {
			return Promise.resolve(value as MaybePromise<T>).then(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				(value: T): VoidableResult<T, E> => ok(value) as any,
				(error) => handleError<T, E>(handler, error),
			);
		}

		if(isAsyncIterable<T>(value)) {
			return xtryAsyncIterable(value, handler);
		}

		if(isSyncIterable<T>(value)) {
			return xtrySyncIterable(value, handler);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		return handleError<T, E>(handler, error);
	}
} // }}}

export function xtrySync<T, E = unknown>(func: NonPromiseCallback<T>, handler?: ErrorHandler<E>): VoidableResult<T, E> { // {{{
	try {
		const value = func();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		return handleError<T, E>(handler, error);
	}
} // }}}

export async function xtryAsync<T, E = unknown>(func: PromiseCallback<T>, handler?: ErrorHandler<E>): Promise<VoidableResult<T, E>> { // {{{
	try {
		const value = await (func instanceof Promise ? func : Promise.resolve().then(func));

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		return handleError<T, E>(handler, error);
	}
} // }}}

export function xtrySyncIterable<T, E = unknown>(iterable: Iterable<T> | (() => Iterable<T>), handler?: ErrorHandler<E>): Iterable<VoidableResult<T, E>> { // {{{
	const generator = iterable instanceof Function ? iterable : () => iterable;

	function * iterate(): Generator<VoidableResult<T, E>, void, undefined> {
		let source: Iterable<T>;

		try {
			source = generator();
		}
		catch (error) {
			yield handleError<T, E>(handler, error);
			return;
		}

		if(!source || typeof source[Symbol.iterator] !== 'function') {
			yield handleError<T, E>(handler, new TypeError('xtryIterable expects an Iterable'));
			return;
		}

		const iterator = source[Symbol.iterator]();

		while(true) {
			let step: IteratorResult<T>;

			try {
				step = iterator.next();
			}
			catch (error) {
				yield handleError<T, E>(handler, error);
				return;
			}

			if(step.done) {
				return;
			}

			yield ok(step.value) as any;
		}
	}

	return iterate();
} // }}}

export function xtryAsyncIterable<T, E = unknown>(iterable: AsyncIterable<T> | Promise<AsyncIterable<T>> | (() => MaybePromise<AsyncIterable<T>>), handler?: ErrorHandler<E>): AsyncIterable<VoidableResult<T, E>> { // {{{
	const generator = iterable instanceof Function ? iterable : async () => iterable;

	async function * iterate(): AsyncGenerator<VoidableResult<T, E>, void, undefined> {
		let source: AsyncIterable<T>;

		try {
			source = await Promise.resolve(generator());
		}
		catch (error) {
			yield handleError<T, E>(handler, error);
			return;
		}

		if(!source || typeof source[Symbol.asyncIterator] !== 'function') {
			yield handleError<T, E>(handler, new TypeError('xtryAsyncIterable expects an AsyncIterable'));
			return;
		}

		const iterator = source[Symbol.asyncIterator]();

		while(true) {
			let step: IteratorResult<T>;

			try {
				step = await iterator.next();
			}
			catch (error) {
				yield handleError<T, E>(handler, error);
				return;
			}

			if(step.done) {
				return;
			}

			yield ok(step.value) as any;
		}
	}

	return iterate();
} // }}}
