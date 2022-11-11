module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  globals: {
    _: 'readonly',
    $: 'readonly',
    M: 'readonly',
    Chart : 'readonly',
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'vue/multi-word-component-names': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars' : 'warn'
  },
};
