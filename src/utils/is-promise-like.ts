type MaybePromise<T> = PromiseLike<T> | T;

export function isPromiseLike<T>(value: MaybePromise<T>): value is PromiseLike<T> {
	return typeof value === 'object' && value !== null && typeof (value as PromiseLike<T>).then === 'function';
}
