import { describe, it, expect } from 'vitest';
import { err, ok, xdefer } from '../src/index.js';
import type { Result } from '../src/result.js';
import { cleanup } from './utils/cleanup.js';
import { type TestResult } from './utils/types.js';

describe('async', () => {
	it('defer-ok - value-ok', async () => { // {{{
		const defer = xdefer(cleanup);

		const initial = ok('value-ok') as TestResult;
		const output = await defer(initial);

		expect(output).to.equals(initial);
		expect(output.fails).to.equals(false);
		expect(output.value).to.equals('value-ok');
	}); // }}}
});

describe('promise', () => {
	it('defer-ok - value-ok', async () => { // {{{
		const defer = xdefer(cleanup());

		const initial = ok('value-ok') as TestResult;
		const output = await defer(initial);

		expect(output).to.equals(initial);
		expect(output.fails).to.equals(false);
		expect(output.value).to.equals('value-ok');
	}); // }}}
});

describe('sync', () => {
	it('defer-ok - value-ok', () => { // {{{
		const defer = xdefer(() => ok() as Result<void, string>);

		const initial = ok('value-ok') as TestResult;
		const output = defer(initial);

		expect(output).to.equals(initial);
		expect(output.fails).to.equals(false);
		expect(output.value).to.equals('value-ok');
	}); // }}}

	it('defer-ok - value-fails', () => { // {{{
		const defer = xdefer(() => ok() as Result<void, string>);
		const initial = err('value-fails') as TestResult;
		const output = defer(initial);

		expect(output).to.equals(initial);
		expect(output.fails).to.equals(true);
		expect(output.error).to.equals('value-fails');
	}); // }}}

	it('defer-ok - value-none', () => { // {{{
		const defer = xdefer(() => ok() as Result<void, string>);
		const output = defer();

		expect(output.fails).to.equals(false);
		expect(output.value).to.be.undefined;
	}); // }}}

	it('defer-fails - value-ok', () => { // {{{
		const defer = xdefer(() => err('defer-fails') as TestResult);
		const initial = ok('value-ok') as TestResult;
		const output = defer(initial);

		expect(output.fails).to.equals(true);
		expect(output.error).to.equals('defer-fails');
	}); // }}}

	it('defer-fails - value-fails', () => { // {{{
		const defer = xdefer(() => err('defer-fails') as TestResult);
		const initial = err('value-fails') as TestResult;
		const output = defer(initial);

		expect(output.fails).to.equals(true);
		expect(output.error).to.equals('value-fails');
	}); // }}}

	it('defer-fails - value-none', () => { // {{{
		const defer = xdefer(() => err('defer-fails') as TestResult);
		const output = defer();

		expect(output.fails).to.equals(true);
		expect(output.error).to.equals('defer-fails');
	}); // }}}
});
