import { type Failure, err } from './result.js';
import { stringifyError } from './stringify-error.js';

export function toStringFailure(error: unknown): Failure<string> {
	return err(stringifyError(error));
}
