export async function successAsync(): Promise<number> {
	return 0;
}

export async function failsAsync(): Promise<number> {
	throw new Error('fails-async');
}

export function successSync(): number {
	return 0;
}

export function failsSync(): number {
	throw new Error('fails-sync');
}

export function successSyncIterable(): Iterable<number> {
	return (function * () {
		yield 0;
		yield 1;
	})();
}

export function failsSyncIterable(): Iterable<number> {
	return (function * () {
		yield 0;
		throw new Error('fails-iterable');
	})();
}

export function successAsyncIterable(): AsyncIterable<number> {
	return (async function * () {
		yield 0;
		yield 1;
	})();
}

export function failsAsyncIterable(): AsyncIterable<number> {
	return (async function * () {
		yield 0;
		throw new Error('fails-async-iterable');
	})();
}
