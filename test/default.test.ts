import { expect, it } from 'vitest';
import { xatry, xtry } from '../src/index.js';

async function getAsync(): Promise<number> {
	return 0;
}

function getSync(): number {
	return 0;
}

function badSync(): number {
	throw new Error('bad');
}

it('success - async', async () => { // {{{
	const { fails, value } = await xatry(getAsync());

	expect(fails).to.equals(false);
	expect(value).to.equals(0);
}); // }}}

it('success - sync', () => { // {{{
	const { fails, value } = xtry(getSync);

	expect(fails).to.equals(false);
	expect(value).to.equals(0);
}); // }}}

it('fails', () => { // {{{
	const result = xtry(badSync);

	expect(result.fails).to.equals(true);
	expect(result.error).to.be.instanceOf(Error);
	expect((result.error as Error).message).to.equals('bad');
}); // }}}
