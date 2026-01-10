import { expect, it } from 'vitest';
import { xtryifyAsync } from '../src/index.js';
import { failsAsync, successAsync } from './utils/helpers.js';

it('sucess', async () => { // {{{
	const wrapped = xtryifyAsync(successAsync);
	const result = await wrapped();

	expect(result.fails).to.equals(false);
	expect(result.value).to.equals(0);
}); // }}}

it('fails', async () => { // {{{
	const wrapped = xtryifyAsync(failsAsync);
	const result = await wrapped();

	expect(result.fails).to.equals(true);
	expect(result.error).to.be.instanceOf(Error);
	expect((result.error!).message).to.equals('fails-async');
}); // }}}

it('argument', async () => { // {{{
	const wrapped = xtryifyAsync(async (a: number, b: number) => a + b);
	const result = await wrapped(2, 3);

	expect(result.fails).to.equals(false);
	expect(result.value).to.equals(5);
}); // }}}
