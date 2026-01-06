import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/async.ts',
		'src/sync.ts',
	],
	format: ['esm', 'cjs'],
	dts: true,
	unbundle: true,
	outDir: 'lib',
	// @ts-ignore
	outputOptions: (options, format, _context) => {
		if(format === 'es') {
			options.dir += '/esm';
		}
		else if(format === 'cjs') {
			options.dir += '/cjs';
		}

		return options;
	}
});
