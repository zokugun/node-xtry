export function isSyncIterable<T>(item: unknown): item is IterableIterator<T> {
	return item !== null && typeof item === 'object' && typeof item[Symbol.iterator] === 'function';
}
