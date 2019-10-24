module.exports = {
  presets: ['@babel/preset-env', '@babel/typescript'],
  babelrc: false,
  plugins: [
    'istanbul',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
};
