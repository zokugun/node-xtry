import { describe, expect, it } from 'vitest';
import { xtryAsync } from '../src/index.js';
import { failsAsync, successAsync } from './utils/helpers.js';

describe('async', () => {
	it('success', async () => { // {{{
		const { fails, value } = await xtryAsync(successAsync);

		expect(fails).to.equals(false);
		expect(value).to.equals(0);
	}); // }}}

	it('fails', async () => { // {{{
		const result = await xtryAsync(failsAsync);

		expect(result.fails).to.equals(true);
		expect(result.error).to.be.instanceOf(Error);
		expect((result.error as Error).message).to.equals('fails-async');
	}); // }}}
});

describe('promise', () => {
	it('success', async () => { // {{{
		const { fails, value } = await xtryAsync(successAsync());

		expect(fails).to.equals(false);
		expect(value).to.equals(0);
	}); // }}}

	it('fails', async () => { // {{{
		const result = await xtryAsync(failsAsync());

		expect(result.fails).to.equals(true);
		expect(result.error).to.be.instanceOf(Error);
		expect((result.error as Error).message).to.equals('fails-async');
	}); // }}}
});
