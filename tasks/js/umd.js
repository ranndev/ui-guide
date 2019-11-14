const path = require('path');
const gulp = require('gulp');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const terser = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');
const config = require('../config');
const utils = require('../utils');

const entry = config.js.entry;
const dest = config.js.dest;
const taskName = utils.taskName(__filename);
const tasks = {
  [taskName + ':transpile']: () =>
    rollup
      .rollup({
        ...config.js.rollup.options,
        input: path.resolve(config.base.entry, entry.path, entry.name + '.ts'),
        plugins: [
          replace({ __DEV__: 'true' }),
          ...config.js.rollup.options.plugins,
          typescript({
            cacheRoot: path.resolve(config.js.rollup.cachePath, 'umd'),
          }),
        ],
      })
      .then((bundle) =>
        bundle.write({
          file: path.resolve(config.base.dest, dest.path, 'umd', dest.name + '.js'),
          format: 'umd',
          name: config.js.rollup.browserName,
          sourcemap: true,
          globals: { 'popper.js': 'Poppoer' },
        }),
      ),
  [taskName + ':transpile-min']: () =>
    rollup
      .rollup({
        ...config.js.rollup.options,
        input: path.resolve(config.base.entry, entry.path, entry.name + '.ts'),
        plugins: [
          ...config.js.rollup.options.plugins,
          terser.terser({
            compress: {
              dead_code: true,
              global_defs: { __DEV__: false },
            },
            sourcemap: true,
          }),
          typescript({
            cacheRoot: path.resolve(config.js.rollup.cachePath, 'umd_min'),
          }),
        ],
      })
      .then((bundle) =>
        bundle.write({
          file: path.resolve(config.base.dest, dest.path, 'umd', dest.name + '.min.js'),
          format: 'umd',
          name: config.js.rollup.browserName,
          sourcemap: true,
          globals: { 'popper.js': 'Poppoer' },
        }),
      ),
};

gulp.task(
  taskName,
  gulp.parallel(tasks[taskName + ':transpile'], tasks[taskName + ':transpile-min']),
);
