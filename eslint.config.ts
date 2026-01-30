import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      '.vinxi/**',
      '.output/**',
      'build/**',
      'dist/**',
      'src/routeTree.gen.ts',
      '.pnpmfile.cjs',
      'tailwind.config.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
