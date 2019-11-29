const path = require('path');
const gulp = require('gulp');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const replace = require('@rollup/plugin-replace');
const config = require('../config');
const utils = require('../utils');

const entry = config.js.entry;
const dest = config.js.dest;

gulp.task(utils.taskName(__filename), () =>
  rollup
    .rollup({
      ...config.js.rollup.options,
      input: path.resolve(config.base.entry, entry.path, entry.name + '.ts'),
      plugins: [
        replace({ __DEV__: 'process.env.NODE_ENV !== "production"' }),
        ...config.js.rollup.options.plugins,
        typescript({
          cacheRoot: path.resolve(config.js.rollup.cachePath, 'esm'),
          tsconfigOverride: {
            compilerOptions: {
              declaration: true,
            },
          },
        }),
      ],
    })
    .then((bundle) =>
      bundle.write({
        file: path.resolve(
          config.base.dest,
          dest.path,
          'esm',
          dest.name + '.js',
        ),
        format: 'esm',
        sourcemap: true,
      }),
    ),
);
