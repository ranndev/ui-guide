module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  babelrc: false,
  plugins: [
    'istanbul',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
};
