import { it, expect } from 'vitest';
import { err, ok, xdeferSync } from '../src/index.js';
import type { Result } from '../src/result.js';
import { type TestResult } from './utils/types.js';

it('defer-ok - value-ok', () => { // {{{
	const defer = xdeferSync(() => ok() as Result<void, string>);
	const initial = ok('value-ok') as TestResult;
	const output = defer(initial);

	expect(output).to.equals(initial);
	expect(output.fails).to.equals(false);
	expect(output.value).to.equals('value-ok');
}); // }}}

it('defer-ok - value-fails', () => { // {{{
	const defer = xdeferSync(() => ok() as Result<void, string>);
	const initial = err('value-fails') as TestResult;
	const output = defer(initial);

	expect(output.fails).to.equals(true);
	expect(output.error).to.equals('value-fails');
}); // }}}

it('defer-fails - value-ok', () => { // {{{
	const defer = xdeferSync(() => err('defer-fails') as Result<void, string>);
	const initial = ok('value-ok') as TestResult;
	const output = defer(initial);

	expect(output.fails).to.equals(true);
	expect(output.error).to.equals('defer-fails');
}); // }}}

it('defer-fails - value-fails', () => { // {{{
	const defer = xdeferSync(() => err('defer-fails') as Result<void, string>);
	const initial = err('value-fails') as TestResult;
	const output = defer(initial);

	expect(output.fails).to.equals(true);
	expect(output.error).to.equals('value-fails');
}); // }}}
