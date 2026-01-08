import { it, expect, expectTypeOf } from 'vitest';
import { err, type Failure, ok, type Result, xdeferAsync } from '../src/index.js';
import { cleanup } from './utils/cleanup.js';
import { type TestResult } from './utils/types.js';

it('defer-ok - value-ok-success', async () => { // {{{
	const defer = xdeferAsync(cleanup);
	const initial = ok('value-ok');
	const output = await defer(initial);

	expectTypeOf(output).toEqualTypeOf<Result<string, string>>();

	expect(output).to.equals(initial);
	expect(output.fails).to.equals(false);
	expect(output.value).to.equals('value-ok');
}); // }}}

it('defer-ok - value-ok-result', async () => { // {{{
	const defer = xdeferAsync(cleanup);
	const initial = ok('value-ok') as TestResult;
	const output = await defer(initial);

	expectTypeOf(output).toEqualTypeOf<Result<string, string>>();

	expect(output).to.equals(initial);
	expect(output.fails).to.equals(false);
	expect(output.value).to.equals('value-ok');
}); // }}}

it('defer-ok - value-fails-failure', async () => { // {{{
	const defer = xdeferAsync(cleanup);
	const initial = err('value-fails'); // as TestResult;
	const output = await defer(initial);

	expectTypeOf(output).toEqualTypeOf<Failure<string>>();

	expect(output.fails).to.equals(true);
	expect(output.error).to.equals('value-fails');
}); // }}}

it('defer-ok - value-fails-result', async () => { // {{{
	const defer = xdeferAsync(cleanup);
	const initial = err('value-fails') as TestResult;
	const output = await defer(initial);

	expectTypeOf(output).toEqualTypeOf<Result<string, string>>();

	expect(output.fails).to.equals(true);
	expect(output.error).to.equals('value-fails');
}); // }}}

it('defer-fails - value-ok', async () => { // {{{
	const defer = xdeferAsync(cleanup('defer-fails'));
	const initial = ok('value-ok') as TestResult;
	const output = await defer(initial);

	expect(output.fails).to.equals(true);
	expect(output.error).to.equals('defer-fails');
}); // }}}

it('defer-fails - value-fails', async () => { // {{{
	const defer = xdeferAsync(async () => cleanup('defer-fails'));
	const initial = err('value-fails') as TestResult;
	const output = await defer(initial);

	expect(output.fails).to.equals(true);
	expect(output.error).to.equals('value-fails');
}); // }}}
