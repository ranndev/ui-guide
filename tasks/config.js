const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const common = require('rollup-plugin-commonjs');

module.exports = {
  base: {
    dest: path.resolve(__dirname, '../dist'),
    entry: path.resolve(__dirname, '..'),
  },
  js: {
    dest: {
      name: 'ui-guide',
      path: 'js',
    },
    entry: {
      name: 'ui-guide',
      path: 'src',
    },
    rollup: {
      cachePath: path.resolve(__dirname, '../.ts_cache'),
      options: {
        plugins: [resolve, common],
        external: ['popper.js'],
      },
      browserName: 'uiguide',
    },
  },
  scss: {
    dest: {
      path: 'scss',
    },
    entry: {
      glob: 'src/*.scss',
    },
    themes: {
      dest: {
        path: 'scss/themes',
      },
      entry: {
        glob: 'themes/*.scss',
      },
    },
  },
  css: {
    dest: {
      path: 'css',
    },
    entry: {
      glob: 'src/ui-guide.scss',
    },
    themes: {
      dest: {
        path: 'css/themes',
      },
      entry: {
        glob: 'themes/*.scss',
      },
    },
  },
  typings: {
    dest: {
      path: 'typings',
    },
    entry: {
      glob: 'src/ui-guide.d.ts',
    },
  },
};
