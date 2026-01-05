import { describe, expect, it } from 'vitest';
import { xtry } from '../src/index.js';
import { failsAsync, failsSync, successAsync, successSync } from './utils/helpers.js';

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
