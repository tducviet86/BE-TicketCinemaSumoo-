// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist', 'node_modules'],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // TẮT rule conflict với Prettier
  prettier,

  // Bật Prettier plugin
  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // Prettier
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          printWidth: 100,
          tabWidth: 2,
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
        },
      ],
    },
  },
);
