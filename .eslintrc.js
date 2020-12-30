/* eslint-disable prettier/prettier */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'vue/no-v-html': 'off',
    'vue/attribute-hyphenation': 'off',
    'prettier/prettier': [ 'error', {
     'endOfLine': 'auto'
    }],
    'no-func-assign': 'off',
    'vue/require-default-prop': 'off',
    'vue/valid-v-slot': 'off'
  },
}
