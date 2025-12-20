import { err, ok, type Result } from './result.js';

export function xtry<T, E = unknown>(
	func: () => Exclude<T, Promise<unknown>>,
	handler?: (error: unknown) => E | undefined,
): E extends void ? Result<T, unknown> : Result<T, E> {
	try {
		const value = func();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		if(handler) {
			const newError = handler(error);

			if(newError !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return err(newError) as any;
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return err(error as E) as any;
	}
}

export async function xatry<T, E = unknown>(
	func: (() => Exclude<T, Promise<unknown>>) | Promise<Exclude<T, Promise<unknown>>>,
	handler?: (error: unknown) => E | undefined,
): Promise<E extends void ? Result<T, unknown> : Result<T, E>> {
	try {
		const value = await (func instanceof Promise ? func : Promise.resolve().then(func));

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return ok(value) as any;
	}
	catch (error) {
		if(handler) {
			const newError = handler(error);

			if(newError !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return err(newError) as any;
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return err(error as E) as any;
	}
}

