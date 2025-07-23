module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.js',
    'node_modules',
    'build',
    'public',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'warn',
    'no-var': 'error',
    'no-unused-vars': [
      'warn',
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      },
    ],
    'no-useless-escape': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};