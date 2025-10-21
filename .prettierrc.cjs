module.exports = {
  eslintIntegration: true,
  // tabWidth: 2,
  // trailingComma: 'none'
  // semi: false,
  // singleQuote: true,
  organizeImportsSkipDestructiveCodeActions: true,
  endOfLine: 'auto',
  printWidth: 120,
  overrides: [{ files: '.prettierrc', options: { parser: 'json' } }]
  // plugins: ["prettier-plugin-organize-imports", "prettier-plugin-packagejson", "prettier-plugin-tailwindcss"],
}
