import { describe, expect, it, vi } from 'vitest';

import { err, ok } from '../src/result.js';
import { map, match, unwrap, unwrapOr } from '../src/unwrap.js';

describe('map', () => {
	it('transforms successful results', () => {
		const transform = vi.fn((value: number) => value.toString());

		expect(map(ok(42), transform)).to.deep.equal(ok('42'));
		expect(transform).toHaveBeenCalledWith(42);
	});

	it('returns failures without transforming them', () => {
		const result = err('failure');
		const transform = vi.fn((value: number) => value.toString());

		expect(map(result, transform)).to.equal(result);
		expect(transform).not.toHaveBeenCalled();
	});
});

describe('match', () => {
	it('calls the success handler for successful results', () => {
		const handlers = {
			failure: vi.fn(() => 'failure'),
			success: vi.fn((value: number) => `success: ${value}`),
		};

		expect(match(ok(42), handlers)).to.equal('success: 42');
		expect(handlers.success).toHaveBeenCalledWith(42);
		expect(handlers.failure).not.toHaveBeenCalled();
	});

	it('calls the failure handler for failed results', () => {
		const handlers = {
			failure: vi.fn((error: string) => `failure: ${error}`),
			success: vi.fn((value: number) => `success: ${value}`),
		};

		expect(match(err('bad input'), handlers)).to.equal('failure: bad input');
		expect(handlers.failure).toHaveBeenCalledWith('bad input');
		expect(handlers.success).not.toHaveBeenCalled();
	});
});

describe('unwrap', () => {
	it('returns successful values', () => {
		expect(unwrap(ok(42))).to.equal(42);
	});

	it('throws an existing Error failure unchanged', () => {
		const error = new Error('failure');

		expect(() => unwrap(err(error))).toThrow(error);
	});

	it('converts non-Error failures to Errors', () => {
		expect(() => unwrap(err({ reason: 'failure' }))).toThrow(new Error('{"reason":"failure"}'));
	});
});

describe('unwrapOr', () => {
	it('returns successful values', () => {
		expect(unwrapOr(ok(42), 'fallback')).to.equal(42);
	});

	it('returns the fallback for failed results', () => {
		expect(unwrapOr(err('failure'), 'fallback')).to.equal('fallback');
	});
});
