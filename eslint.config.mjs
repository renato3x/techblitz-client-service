import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      eqeqeq: ['error', 'always'],
      semi: ['error', 'always'],
      curly: ['error', 'all'],
      'comma-dangle': ['error', 'always-multiline'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'no-template-curly-in-string': 'error',
    },
  },
];

export default eslintConfig;
