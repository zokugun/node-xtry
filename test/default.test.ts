import { expect } from 'chai';
import { xatry, xtry } from '../src/index.js';

async function getAsync(): Promise<number> {
	return 0;
}

function getSync(): number {
	return 0;
}

describe('default', async () => {
	it('async', async () => { // {{{
		const { fails, value } = await xatry(getAsync());

		expect(fails).to.equals(false);
		expect(value).to.equals(0);
	}); // }}}

	it('sync', () => { // {{{
		const { fails, value } = xtry(getSync);

		expect(fails).to.equals(false);
		expect(value).to.equals(0);
	}); // }}}
});
