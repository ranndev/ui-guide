const gulp = require('gulp');
const clean = require('gulp-clean');
const config = require('./tasks/config');

require('./tasks/css/main');
require('./tasks/css/themes');
require('./tasks/js/cjs');
require('./tasks/js/esm');
require('./tasks/js/umd');
require('./tasks/scss/main');
require('./tasks/scss/themes');
require('./tasks/typings');

gulp.task('clean', () =>
  gulp.src(config.base.dest + '/*', { allowEmpty: true, read: false }).pipe(clean()),
);

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'css/main',
      'css/themes',
      'js/cjs',
      'js/esm',
      'js/umd',
      'scss/main',
      'scss/themes',
      'typings/index',
    ),
  ),
);
