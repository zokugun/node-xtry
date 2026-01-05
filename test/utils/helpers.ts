export async function successAsync(): Promise<number> {
	return 0;
}

export async function failsAsync(): Promise<number> {
	throw new Error('fails-async');
}

export function successSync(): number {
	return 0;
}

export function failsSync(): number {
	throw new Error('fails-sync');
}
