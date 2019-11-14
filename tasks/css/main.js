const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const config = require('../config');
const utils = require('../utils');

const taskName = utils.taskName(__filename);
const tasks = {
  [taskName + ':compile']: () =>
    gulp
      .src(path.resolve(config.base.entry, config.css.entry.glob))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.resolve(config.base.dest, config.css.dest.path))),
  [taskName + ':compile-min']: () =>
    gulp
      .src(path.resolve(config.base.entry, config.css.entry.glob))
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.resolve(config.base.dest, config.css.dest.path))),
};

gulp.task(
  taskName,
  gulp.parallel(tasks[taskName + ':compile'], tasks[taskName + ':compile-min']),
);
