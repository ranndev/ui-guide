const path = require('path');
const gulp = require('gulp');

module.exports = function registerBuildSCSSTasks(config) {
  gulp.task(
    'scss:copy',
    gulp.parallel(
      () => {
        return gulp
          .src(path.join(config.src, '*.scss'))
          .pipe(gulp.dest(path.join(config.dist, 'scss')));
      },
      () => {
        return gulp
          .src(path.join(process.cwd(), 'themes/*.scss'))
          .pipe(gulp.dest(path.join(config.dist, 'scss/themes')));
      },
    ),
  );
};
