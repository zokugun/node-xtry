export async function failsAsync(): Promise<number> {
	throw new Error('fails-async');
}

export function failsAsyncIterable(): AsyncIterable<number> {
	// eslint-disable-next-line func-names, ts/explicit-function-return-type
	return (async function *() {
		yield 0;
		throw new Error('fails-async-iterable');
	})();
}

export function failsSync(): number {
	throw new Error('fails-sync');
}

export function failsSyncIterable(): Iterable<number> {
	// eslint-disable-next-line func-names, ts/explicit-function-return-type
	return (function *() {
		yield 0;
		throw new Error('fails-sync-iterable');
	})();
}

export async function successAsync(): Promise<number> {
	return 0;
}

export function successAsyncIterable(): AsyncIterable<number> {
	// eslint-disable-next-line func-names, ts/explicit-function-return-type
	return (async function *() {
		yield 0;
		yield 1;
	})();
}

export function successSync(): number {
	return 0;
}

export function successSyncIterable(): Iterable<number> {
	// eslint-disable-next-line func-names, ts/explicit-function-return-type
	return (function *() {
		yield 0;
		yield 1;
	})();
}
