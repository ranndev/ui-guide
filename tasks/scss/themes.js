const path = require('path');
const gulp = require('gulp');
const config = require('../config');
const utils = require('../utils');

gulp.task(utils.taskName(__filename), () =>
  gulp
    .src(path.resolve(config.base.entry, config.scss.themes.entry.glob))
    .pipe(gulp.dest(path.resolve(config.base.dest, config.scss.themes.dest.path))),
);
