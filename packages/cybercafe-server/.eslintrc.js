/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@weirdscience/eslint-config/packages.js"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.lint.json",
  },
};
