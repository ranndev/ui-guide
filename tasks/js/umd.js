const path = require('path');
const gulp = require('gulp');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const terser = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');
const config = require('../config');
const utils = require('../utils');

const taskName = utils.taskName(__filename);
const entry = config.js.entry;
const dest = config.js.dest;

function transpile({ minified = false } = {}) {
  const filename = dest.name + (minified ? '.min.js' : '.js');
  const plugins = [
    !minified && replace({ __DEV__: 'true' }),
    ...config.js.rollup.options.plugins,
    minified &&
      terser.terser({
        compress: {
          dead_code: true,
          global_defs: { __DEV__: false },
        },
        sourcemap: true,
      }),
    typescript({
      cacheRoot: path.resolve(
        config.js.rollup.cachePath,
        minified ? 'umd_min' : 'umd',
      ),
    }),
  ];

  return rollup
    .rollup({
      ...config.js.rollup.options,
      input: path.resolve(config.base.entry, entry.path, entry.name + '.ts'),
      plugins: plugins.filter(Boolean),
    })
    .then((bundle) =>
      bundle.write({
        file: path.resolve(config.base.dest, dest.path, 'umd', filename),
        format: 'umd',
        name: config.js.rollup.browserName,
        sourcemap: true,
        globals: { 'popper.js': 'Popper' },
      }),
    );
}

const tasks = {
  [taskName + ':transpile']: () => transpile(),
  [taskName + ':transpile-min']: () => transpile({ minified: true }),
};

gulp.task(
  taskName,
  gulp.parallel(
    tasks[taskName + ':transpile'],
    tasks[taskName + ':transpile-min'],
  ),
);
