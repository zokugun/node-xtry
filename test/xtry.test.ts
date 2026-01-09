import { describe, expect, it } from 'vitest';
import { type Result, xtry } from '../src/index.js';
import { failsAsync, failsAsyncIterable, failsSyncIterable, failsSync, successAsync, successAsyncIterable, successSyncIterable, successSync } from './utils/helpers.js';

describe('async', () => {
	it('success', async () => { // {{{
		const { fails, value } = await xtry(successAsync);

		expect(fails).to.equals(false);
		expect(value).to.equals(0);
	}); // }}}

	it('fails', async () => { // {{{
		const result = await xtry(failsAsync);

		expect(result.fails).to.equals(true);
		expect(result.error).to.be.instanceOf(Error);
		expect((result.error as Error).message).to.equals('fails-async');
	}); // }}}
});

describe('promise', () => {
	it('success', async () => { // {{{
		const { fails, value } = await xtry(successAsync());

		expect(fails).to.equals(false);
		expect(value).to.equals(0);
	}); // }}}

	it('fails', async () => { // {{{
		const result = await xtry(failsAsync());

		expect(result.fails).to.equals(true);
		expect(result.error).to.be.instanceOf(Error);
		expect((result.error as Error).message).to.equals('fails-async');
	}); // }}}
});

describe('sync', () => {
	it('success', () => { // {{{
		const { fails, value } = xtry(successSync);

		expect(fails).to.equals(false);
		expect(value).to.equals(0);
	}); // }}}

	it('fails', () => { // {{{
		const result = xtry(failsSync);

		expect(result.fails).to.equals(true);
		expect(result.error).to.be.instanceOf(Error);
		expect((result.error as Error).message).to.equals('fails-sync');
	}); // }}}
});

describe('sync-iterable', () => {
	it('sucess - direct', () => {
		const wrapped = xtry(successSyncIterable());
		const results = Array.from(wrapped);

		expect(results).to.have.lengthOf(2);
		expect(results[0]?.fails).to.equals(false);
		expect(results[0]?.value).to.equals(0);
		expect(results[1]?.value).to.equals(1);
	});

	it('sucess - factory', () => {
		const wrapped = xtry(() => successSyncIterable());
		const results = Array.from(wrapped);

		expect(results).to.have.lengthOf(2);
	});

	it('fails - no-handler', () => {
		const wrapped = xtry(failsSyncIterable());
		const results = Array.from(wrapped);
		const failure = results.at(-1);

		expect(failure?.fails).to.equals(true);
		expect((failure?.error as Error).message).to.equals('fails-iterable');
	});

	it('fails - with-handler', () => {
		const wrapped = xtry(failsSyncIterable(), () => new Error('wrapped'));
		const results = Array.from(wrapped);
		const failure = results.at(-1);

		expect(failure?.fails).to.equals(true);
		expect(failure?.error!.message).to.equals('wrapped');
	});
});

describe('async-iterable', () => {
	it('success - direct', async () => {
		const wrapped = xtry(successAsyncIterable());
		const results: Array<Result<number, unknown>> = [];

		for await (const result of wrapped) {
			results.push(result);
		}

		expect(results).to.have.lengthOf(2);
	});

	it('success - factory', async () => {
		const wrapped = xtry(() => successAsyncIterable());
		const results: Array<Result<number, unknown>> = [];

		for await (const result of wrapped) {
			results.push(result);
		}

		expect(results).to.have.lengthOf(2);
	});

	it('fails - no-handler', async () => {
		const wrapped = xtry(failsAsyncIterable());
		const results: Array<Result<number, Error>> = [];

		for await (const result of wrapped) {
			results.push(result as Result<number, Error>);
		}

		const failure = results.at(-1);

		expect(failure?.fails).to.equals(true);
		expect(failure?.error!.message).to.equals('fails-async-iterable');
	});

	it('fails - with-handler', async () => {
		const wrapped = xtry(failsAsyncIterable(), () => new Error('async-wrapped'));
		const results: Array<Result<number, Error>> = [];

		for await (const result of wrapped) {
			results.push(result);
		}

		const failure = results.at(-1);

		expect(failure?.fails).to.equals(true);
		expect(failure?.error!.message).to.equals('async-wrapped');
	});
});
