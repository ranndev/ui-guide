const path = require('path');
const gulp = require('gulp');

module.exports = function registerBuildSCSSTasks(config) {
  gulp.task('scss:copy', () => {
    return gulp
      .src(path.join(config.src, `${config.name}.scss`), { base: './src' })
      .pipe(gulp.dest(path.join(config.dist, 'scss')));
  });
};
