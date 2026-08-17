import { expect, it } from 'vitest';

import { failsSyncIterable, successSyncIterable } from './utils/helpers.js';
import { xtryifySyncIterable } from '../src/index.js';

it('sucess', () => { // {{{
	const wrapped = xtryifySyncIterable(successSyncIterable);
	const results = Array.from(wrapped());

	expect(results).to.have.lengthOf(2);
	expect(results[0]?.fails).to.equals(false);
	expect(results[0]?.value).to.equals(0);
	expect(results[1]?.fails).to.equals(false);
	expect(results[1]?.value).to.equals(1);
}); // }}}

it('fails', () => { // {{{
	const wrapped = xtryifySyncIterable(failsSyncIterable);
	const results = Array.from(wrapped());

	expect(results).to.have.lengthOf(2);

	const [success, failure] = results;

	expect(success?.fails).to.equals(false);
	expect(success?.value).to.equals(0);
	expect(failure?.fails).to.equals(true);
	expect(failure?.error!.message).to.equals('fails-sync-iterable');
}); // }}}
