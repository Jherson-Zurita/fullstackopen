import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-console': 'off',
      'no-unused-vars': 'error',
      'arrow-spacing': ['error', { before: true, after: true }]
    }
  },
  {
    ignores: ['node_modules/**']
  }
]
