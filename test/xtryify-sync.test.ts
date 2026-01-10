import { expect, it } from 'vitest';
import { xtryifySync } from '../src/index.js';
import { failsSync, successSync } from './utils/helpers.js';

it('sucess', () => { // {{{
	const wrapped = xtryifySync(successSync);
	const result = wrapped();

	expect(result.fails).to.equals(false);
	expect(result.value).to.equals(0);
}); // }}}

it('fails', () => { // {{{
	const wrapped = xtryifySync(failsSync);
	const result = wrapped();

	expect(result.fails).to.equals(true);
	expect(result.error).to.be.instanceOf(Error);
	expect(result.error!.message).to.equals('fails-sync');
}); // }}}

it('argument', () => { // {{{
	const wrapped = xtryifySync((a: number, b: number) => a + b);
	const result = wrapped(2, 3);

	expect(result.fails).to.equals(false);
	expect(result.value).to.equals(5);
}); // }}}
