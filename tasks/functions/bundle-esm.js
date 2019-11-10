const rollup = require('rollup');
const typescriptPlugin = require('rollup-plugin-typescript2');
const terserPlugin = require('rollup-plugin-terser');

/**
 * Bundle the source code to `esm` format.
 * @param {any} config
 */
module.exports = async function bundleESM(config) {
  const options = config.commonRollupOptions();

  options.plugins = options.plugins || [];

  options.plugins.push(
    terserPlugin.terser({
      compress: {
        dead_code: true,
        global_defs: {
          '@__DEV__': `process.env.NODE_ENV !== 'production'`,
        },
      },
      mangle: false,
      output: { comments: 'all' },
      keep_classnames: true,
      keep_fnames: true,
    }),
  );

  options.plugins.push(
    typescriptPlugin({
      cacheRoot: '.ts_cache/esm',
      // tsconfigOverride: {
      //   compilerOptions: {
      //     declaration: true,
      //   },
      // },
    }),
  );

  const bundle = await rollup.rollup(options);

  await bundle.write({
    file: `${config.dist}/esm/${config.name}.js`,
    format: 'esm',
    sourcemap: true,
  });
};
