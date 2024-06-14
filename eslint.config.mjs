import globals from 'globals'
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'



export default [
  {
    files: ['**/*.js'],
    rules: js.configs.recommended.rules,
    languageOptions: { sourceType: 'commonjs' }
  },
  { ignores: ['dist'] },
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      'no-unused-vars': 0,
      'linebreak-style': 0,
      'eqeqeq': ['error'],
      'no-console': 0,
      'no-trailing-spaces': ['error'],
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      }
    }
  },
]