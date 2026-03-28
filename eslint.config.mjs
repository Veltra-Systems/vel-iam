import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginSecurity from 'eslint-plugin-security'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'], // Don't lint the ESLint config file itself
  },
  eslint.configs.recommended, // Base JS rules: no-unused-vars, no-undef, etc.
  ...tseslint.configs.recommendedTypeChecked, // TypeScript rules that use type info
  eslintPluginPrettierRecommended, // Run Prettier as an ESLint rule
  {
    plugins: {
      security: pluginSecurity, // Register the security plugin
    },
    rules: {
      ...pluginSecurity.configs.recommended.rules, // Detect common security vulnerabilities
      // Flags: unsafe regex, non-literal fs paths, object injection, eval usage, etc.
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node, // Know Node.js globals: process, __dirname, Buffer, etc.
        ...globals.jest, // Know Jest globals: describe, it, expect, beforeEach, etc.
      },
      sourceType: 'module', // Files use ESM (import/export)
      parserOptions: {
        projectService: true, // Use tsconfig.json for type-aware linting
        tsconfigRootDir: import.meta.dirname, // Root dir to find tsconfig.json
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Warn when using type any explicitly
      '@typescript-eslint/no-floating-promises': 'error', // Error if async call is not awaited
      '@typescript-eslint/no-unsafe-argument': 'warn', // Warn when passing any-typed arg to a function
      '@typescript-eslint/strict-boolean-expressions': 'warn', // Warn on non-boolean in if/while conditions
      '@typescript-eslint/explicit-function-return-type': 'warn', // Warn if function has no return type declared
      '@typescript-eslint/prefer-readonly': 'warn', // Warn if class property could be readonly
      '@typescript-eslint/consistent-type-imports': 'error', // Force: import type { X } for type-only imports
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // Format errors = ESLint errors, auto line endings
    },
  },
)
