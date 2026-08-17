type MaybePromise<T> = PromiseLike<T> | T;

export function isPromiseLike<T>(value: MaybePromise<T>): value is PromiseLike<T> {
	// eslint-disable-next-line ts/no-unsafe-type-assertion
	return typeof value === 'object' && value !== null && typeof (value as PromiseLike<T>).then === 'function';
}
