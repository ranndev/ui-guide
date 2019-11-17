const fs = require('fs');
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
        minified ? 'cjs_min' : 'cjs',
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
        file: path.resolve(config.base.dest, dest.path, 'cjs', filename),
        format: 'cjs',
        sourcemap: true,
      }),
    );
}

const tasks = {
  [taskName + ':write-index']: (done) => {
    const content = [
      `if (process.env.NODE_ENV === 'production') {`,
      `  module.exports = require('./${dest.name}.min.js')`,
      '} else {',
      `  module.exports = require('./${dest.name}.js')`,
      '}',
    ].join('\n');

    fs.writeFile(
      path.resolve(config.base.dest, dest.path, 'cjs/index.js'),
      content,
      done,
    );
  },
  [taskName + ':transpile']: () => transpile(),
  [taskName + ':transpile-min']: () => transpile({ minified: true }),
};

gulp.task(
  taskName,
  gulp.series(
    gulp.parallel(
      tasks[taskName + ':transpile'],
      tasks[taskName + ':transpile-min'],
    ),
    tasks[taskName + ':write-index'],
  ),
);
