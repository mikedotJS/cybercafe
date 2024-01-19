/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@weirdscience/eslint-config/packages.js"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.lint.json",
  },
  overrides: [
    // ... existing overrides
    {
      files: ["**/*.test.ts"],
      env: {
        jest: true, // or another test environment if you're not using Jest
      },
      // Add any test-specific rules or plugins here
    },
  ],
};
