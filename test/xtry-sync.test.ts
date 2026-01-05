import { expect, it } from 'vitest';
import { xtrySync } from '../src/index.js';
import { failsSync, successSync } from './utils/helpers.js';

it('success', () => { // {{{
	const { fails, value } = xtrySync(successSync);

	expect(fails).to.equals(false);
	expect(value).to.equals(0);
}); // }}}

it('fails', () => { // {{{
	const result = xtrySync(failsSync);

	expect(result.fails).to.equals(true);
	expect(result.error).to.be.instanceOf(Error);
	expect((result.error as Error).message).to.equals('fails-sync');
}); // }}}
