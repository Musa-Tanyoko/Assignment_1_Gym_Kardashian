/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
  },
}; 