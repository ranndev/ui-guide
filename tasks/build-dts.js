const path = require('path');
const gulp = require('gulp');

module.exports = function registerBuildSCSSTasks(config) {
  gulp.task('dts:copy', () => {
    return gulp
      .src(path.join(config.src, 'ui-guide.d.ts'))
      .pipe(gulp.dest(path.join(config.dist, 'typings')));
  });
};
