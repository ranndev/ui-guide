const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

module.exports = function registerBuildCSSTasks(config) {
  gulp.task(
    'css:compile-development',
    gulp.parallel(
      () => {
        return gulp
          .src(path.join(config.src, `${config.name}.scss`))
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(path.join(config.dist, 'css')));
      },
      () => {
        return gulp
          .src(path.join(process.cwd(), 'themes/*.scss'))
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(path.join(config.dist, 'css/themes')));
      },
    ),
  );

  gulp.task(
    'css:compile-production',
    gulp.parallel(
      () => {
        return gulp
          .src(path.join(config.src, `${config.name}.scss`))
          .pipe(sourcemaps.init())
          .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
          .pipe(rename({ suffix: '.min' }))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(path.join(config.dist, 'css')));
      },
      () => {
        return gulp
          .src(path.join(process.cwd(), 'themes/*.scss'))
          .pipe(sourcemaps.init())
          .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
          .pipe(rename({ suffix: '.min' }))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(path.join(config.dist, 'css/themes')));
      },
    ),
  );

  gulp.task(
    'css:build-production',
    gulp.parallel('css:compile-development', 'css:compile-production'),
  );
};
