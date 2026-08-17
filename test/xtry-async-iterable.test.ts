import { expect, it } from 'vitest';

import { failsAsyncIterable, successAsyncIterable } from './utils/helpers.js';
import { type Result, xtryAsyncIterable } from '../src/index.js';

it('success', async () => {
	const iterator = xtryAsyncIterable(successAsyncIterable());
	const results: Array<Result<number, unknown>> = [];

	for await(const result of iterator) {
		results.push(result);
	}

	expect(results).to.have.lengthOf(2);
	expect(results[0]?.fails).to.equals(false);
	expect(results[0]?.value).to.equals(0);
	expect(results[1]?.fails).to.equals(false);
	expect(results[1]?.value).to.equals(1);
});

it('fails - no-handler', async () => {
	const iterator = xtryAsyncIterable(failsAsyncIterable());
	const results: Array<Result<number, unknown>> = [];

	for await(const result of iterator) {
		results.push(result);
	}

	expect(results).to.have.lengthOf(2);

	const [success, failure] = results;

	expect(success?.fails).to.equals(false);
	expect(success?.value).to.equals(0);
	expect(failure?.fails).to.equals(true);
	expect((failure?.error as Error).message).to.equals('fails-async-iterable');
});

it('fails - with-handler', async () => {
	const iterator = xtryAsyncIterable(failsAsyncIterable(), () => new Error('async-iterable-handler'));
	const results: Array<Result<number, Error>> = [];

	for await(const result of iterator) {
		results.push(result);
	}

	const [, failure] = results;

	expect(failure?.fails).to.equals(true);
	expect(failure?.error!.message).to.equals('async-iterable-handler');
});
