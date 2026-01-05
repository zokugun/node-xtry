import { err, OK, type Result } from '../../src/result.js';

export async function cleanup(error?: string): Promise<Result<void, string>> {
	if(error) {
		return err(error);
	}

	return OK;
}
