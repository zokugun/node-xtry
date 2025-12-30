import { expect } from 'chai';
import { stringifyError, xtry } from '../src/index.js';

function badSync(): number {
	throw new Error('bad');
}

function assertIsStringOrUndefined(_: string | undefined) {
	void _;
}

function assertIsUnknown(_: unknown) {
	void _;
}

describe('handler', async () => {
	it('log', () => { // {{{
		let log: unknown;

		const result = xtry(badSync, (error) => {
			log = error;
		});

		expect(result.error).to.be.instanceOf(Error);
		expect((result.error as Error).message).to.equals('bad');
		expect(log).to.be.instanceOf(Error);
		expect((log as Error).message).to.equals('bad');

		assertIsUnknown(result.error);
	}); // }}}

	it('transform', () => { // {{{
		const result = xtry(badSync, (error) => `+${stringifyError(error)}`);

		expect(result.error).to.equals('+bad');
	}); // }}}

	it('assert', () => { // {{{
		const result = xtry(badSync, stringifyError);

		assertIsStringOrUndefined(result.error);
	}); // }}}
});
