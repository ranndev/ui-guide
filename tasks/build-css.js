const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

module.exports = function registerBuildCSSTasks(config) {
  gulp.task('css:compile-development', () => {
    return gulp
      .src(path.join(config.src, `${config.name}.scss`), { base: './src' })
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(config.dist, 'css')));
  });

  gulp.task('css:compile-production', () => {
    return gulp
      .src(path.join(config.src, `${config.name}.scss`), { base: './src' })
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(config.dist, 'css')));
  });

  gulp.task(
    'css:build-production',
    gulp.parallel('css:compile-development', 'css:compile-production'),
  );
};
