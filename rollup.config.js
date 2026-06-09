import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const production = process.env.NODE_ENV === 'production';

const plugins = [
  typescript({ 
    tsconfig: './tsconfig.json',
    jsx: 'react',  // Add JSX support
    jsxFactory: 'createElement'
  }),
  production && terser()
].filter(Boolean);

export default [
  // Core ESM/CJS
  {
    input: 'src/core/index.ts',
    output: [
      { file: 'dist/core/index.js', format: 'esm', sourcemap: true, exports: 'named' },
      { file: 'dist/core/index.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    plugins
  },
  // React adapter
  {
    input: 'src/adapters/react.ts',
    output: [
      { file: 'dist/adapters/react.js', format: 'esm', sourcemap: true, exports: 'named' },
      { file: 'dist/adapters/react.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    external: ['react', '../core/index.js'],
    plugins
  },
  // Vue adapter
  {
    input: 'src/adapters/vue.ts',
    output: [
      { file: 'dist/adapters/vue.js', format: 'esm', sourcemap: true, exports: 'named' },
      { file: 'dist/adapters/vue.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    external: ['vue', '../core/index.js'],
    plugins
  },
  // Svelte adapter
  {
    input: 'src/adapters/svelte.ts',
    output: [
      { file: 'dist/adapters/svelte.js', format: 'esm', sourcemap: true, exports: 'named' },
      { file: 'dist/adapters/svelte.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    external: ['svelte/store', '../core/index.js'],
    plugins
  },
  // Solid adapter
  {
    input: 'src/adapters/solid.ts',
    output: [
      { file: 'dist/adapters/solid.js', format: 'esm', sourcemap: true, exports: 'named' },
      { file: 'dist/adapters/solid.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    external: ['solid-js', '../core/index.js'],
    plugins
  },
  // Browser bundle
  {
    input: 'src/browser/index.ts',
    output: { file: 'dist/browser/index.js', format: 'iife', name: 'modernMs', sourcemap: true },
    plugins
  },
  // Streaming
  {
    input: 'src/advanced/streaming.ts',
    output: [
      { file: 'dist/advanced/streaming.js', format: 'esm', sourcemap: true, exports: 'named' },
      { file: 'dist/advanced/streaming.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    external: ['stream', '../core/index.js'],
    plugins
  },
  // Worker
  {
    input: 'src/advanced/worker.ts',
    output: [
      { file: 'dist/advanced/worker.js', format: 'esm', sourcemap: true, exports: 'named' },
      { file: 'dist/advanced/worker.cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    plugins
  },
  // CLI (keep as ESM)
  {
    input: 'src/cli/index.ts',
    output: { 
      file: 'dist/cli/index.js', 
      format: 'esm', 
      sourcemap: true, 
      banner: '#!/usr/bin/env node',
      exports: 'named'
    },
    plugins
  },
  // Type definitions
  {
    input: 'src/core/index.ts',
    output: { file: 'dist/core/index.d.ts', format: 'es' },
    plugins: [dts()]
  },
  {
    input: 'src/adapters/react.ts',
    output: { file: 'dist/adapters/react.d.ts', format: 'es' },
    plugins: [dts()]
  },
  {
    input: 'src/adapters/vue.ts',
    output: { file: 'dist/adapters/vue.d.ts', format: 'es' },
    plugins: [dts()]
  },
  {
    input: 'src/browser/index.ts',
    output: { file: 'dist/browser/index.d.ts', format: 'es' },
    plugins: [dts()]
  }
];
