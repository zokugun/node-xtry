export function stringifyError(error: unknown): string {
	if(typeof error === 'string') {
		return error;
	}

	if(error instanceof Error) {
		return error.message ?? String(error);
	}

	try {
		const json = JSON.stringify(error);

		if(typeof json === 'string') {
			return json;
		}
	}
	catch {
		// fallthrough
	}

	return String(error);
}
