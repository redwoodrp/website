module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    mocha: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['error', 'single'],
    'space-before-function-paren': ['error', 'always'],
    'max-len': ['error', 200],
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    'no-plusplus': 'off',
  },
};
