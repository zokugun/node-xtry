import { err, type Failure } from './result.js';
import { stringifyError } from './stringify-error.js';

export function toStringFailure(failure: Failure<unknown>): Failure<string> {
	return err(stringifyError(failure.error));
}
