module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: [".eslintrc.cjs"],
      parserOptions: {
        project: null,
      },
    },
  ],
  globals: {
    API: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "2021",
    sourceType: "module",
    project: "./tsconfig.eslint.json",
    extraFileExtensions: [".vue"],
    parser: "@typescript-eslint/parser",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "prettier/prettier": "warn",
    // indent: ["warn", 2],
    "vue/html-indent": ["warn", 2],
    // "max-len": ["warn", { "code": 80 }],
    semi: ["warn", "always"],
    // '@typescript-eslint/indent': ['warn', 2],
    // '@typescript-eslint/semi': ['warn', 'always'],
    // "linebreak-style": ['warn', 'unix'],
    // quotes: 'warn',
    "no-multi-spaces": "warn",
    "no-trailing-spaces": "warn",
    "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0 }],
    "vue/valid-v-on": "warn",
    "no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
