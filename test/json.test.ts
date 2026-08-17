import { expectTypeOf, it } from 'vitest';

import { parseJson, type Result } from '../src/index.js';

// eslint-disable-next-line ts/no-unsafe-function-type
type NotFunction<T> = T extends Function ? never : T;

it('returnType', () => {
	expectTypeOf(parseJson).returns.toEqualTypeOf<Result<NotFunction<any>, SyntaxError>>();

	const value = parseJson('{}');
	expectTypeOf(value).toEqualTypeOf<Result<NotFunction<any>, SyntaxError>>();
});
