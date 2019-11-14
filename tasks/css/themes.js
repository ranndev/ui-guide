const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const config = require('../config');
const utils = require('../utils');

function compile({ minified = false } = {}) {
  return gulp
    .src(path.resolve(config.base.entry, config.css.themes.entry.glob))
    .pipe(sourcemaps.init())
    .pipe(
      sass({ outputStyle: minified ? 'compressed' : 'nested' }).on(
        'error',
        sass.logError,
      ),
    )
    .pipe(gulpif(minified, rename({ suffix: '.min' })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.resolve(config.base.dest, config.css.themes.dest.path)));
}

const taskName = utils.taskName(__filename);
const tasks = {
  [taskName + ':compile']: () => compile(),
  [taskName + ':compile-min']: () => compile({ minified: true }),
};

gulp.task(
  taskName,
  gulp.parallel(tasks[taskName + ':compile'], tasks[taskName + ':compile-min']),
);
