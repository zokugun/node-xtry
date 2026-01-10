import { expect, it } from 'vitest';
import { type Result, xtryifyAsyncIterable } from '../src/index.js';
import { failsAsyncIterable, successAsyncIterable } from './utils/helpers.js';

it('sucess', async () => { // {{{
	const wrapped = xtryifyAsyncIterable(successAsyncIterable);
	const results: Array<Result<number, unknown>> = [];

	for await (const result of wrapped()) {
		results.push(result);
	}

	expect(results).to.have.lengthOf(2);
	expect(results[0]?.fails).to.equals(false);
	expect(results[0]?.value).to.equals(0);
	expect(results[1]?.fails).to.equals(false);
	expect(results[1]?.value).to.equals(1);
}); // }}}

it('fails', async () => { // {{{
	const wrapped = xtryifyAsyncIterable(failsAsyncIterable);
	const results: Array<Result<number, unknown>> = [];

	for await (const result of wrapped()) {
		results.push(result);
	}

	expect(results).to.have.lengthOf(2);

	const success = results[0];
	const failure = results[1];

	expect(success?.fails).to.equals(false);
	expect(success?.value).to.equals(0);
	expect(failure?.fails).to.equals(true);
	expect((failure?.error as Error).message).to.equals('fails-async-iterable');
}); // }}}
