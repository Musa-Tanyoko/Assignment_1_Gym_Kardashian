/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-refresh/recommended",
    "plugin:perfectionist/recommended-natural",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-refresh", "perfectionist"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "perfectionist/sort-imports": [
      "error",
      {
        type: "natural",
        order: "asc",
      },
    ],
    "perfectionist/sort-objects": [
      "error",
      {
        type: "natural",
        order: "asc",
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}; 