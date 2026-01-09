import { expect, it } from 'vitest';
import { xtrySyncIterable } from '../src/index.js';
import { failsSyncIterable, successSyncIterable } from './utils/helpers.js';

it('success', () => {
	const iterator = xtrySyncIterable(successSyncIterable());
	const results = Array.from(iterator);

	expect(results).to.have.lengthOf(2);
	expect(results[0]?.fails).to.equals(false);
	expect(results[0]?.value).to.equals(0);
	expect(results[1]?.fails).to.equals(false);
	expect(results[1]?.value).to.equals(1);
});

it('fails - no-handler', () => {
	const iterator = xtrySyncIterable(failsSyncIterable());
	const results = Array.from(iterator);

	expect(results).to.have.lengthOf(2);

	const success = results[0];
	const failure = results[1];

	expect(success?.fails).to.equals(false);
	expect(success?.value).to.equals(0);
	expect(failure?.fails).to.equals(true);
	expect((failure?.error as Error).message).to.equals('fails-iterable');
});

it('fails - with-handler', () => {
	const iterator = xtrySyncIterable(failsSyncIterable(), () => new Error('iterable-handler'));
	const results = Array.from(iterator);

	const failure = results[1];

	expect(failure?.fails).to.equals(true);
	expect(failure?.error!.message).to.equals('iterable-handler');
});
