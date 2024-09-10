import { build } from 'esbuild';

await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/index.js',
  platform: 'node',
  bundle: true,
  minify: true,
});
