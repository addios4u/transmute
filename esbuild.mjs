import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const extensionConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  outfile: 'out/extension.js',
  sourcemap: true,
};

if (isWatch) {
  const ctx = await esbuild.context(extensionConfig);
  await ctx.watch();
  console.log('[Transmute] Watching extension...');
} else {
  await esbuild.build(extensionConfig);
  console.log('[Transmute] Extension build complete');
}
