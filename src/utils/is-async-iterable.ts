export function isAsyncIterable<T>(item: unknown): item is AsyncIterableIterator<T> {
	return item !== null && typeof item === 'object' && typeof item[Symbol.asyncIterator] === 'function';
}
