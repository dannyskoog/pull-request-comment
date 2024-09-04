import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/*.?(*)js',
    ],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      "@stylistic/js/semi": "error",
      "@stylistic/js/comma-dangle": ["error", "always-multiline"],
      '@stylistic/js/indent': ['error', 2],
      "@stylistic/js/eol-last": "error",
      "@stylistic/js/object-curly-spacing": ["error", "always"],
    },
  },
];
