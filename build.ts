/// <reference lib="esnext" />
import { context } from 'esbuild'
import { cp, mkdir, readFile } from 'node:fs/promises';

const ctx = await context({
	entryPoints: ['src/main.ts'],
	bundle: true,
	outdir: 'dist',
	logLevel: 'info',
	plugins: [{
		name: 'cjk-friendly',
		setup(build) {
			build.onLoad({ filter: /marked\.(esm|umd)\.js$/ }, async args => {
				let contents = await readFile(args.path, 'utf8');
				contents = contents.replaceAll('"gu"', '"g" ');
				contents = contents.replaceAll('"u")', '"" )');
				contents = contents.replaceAll('/u', '/ ');
				return { contents };
			});
		}
	}]
})

if (process.argv[2] === 'dev') {
	await ctx.serve({ servedir: '.', port: 8000 })
} else {
	await ctx.rebuild()
	await ctx.dispose()
	await mkdir('publish')
	await cp('index.html', 'publish/index.html')
	await cp('dist', 'publish/dist', { recursive: true })
}
