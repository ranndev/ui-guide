const gulp = require('gulp');

const registerBuildCJSTasks = require('./build-cjs');
const registerBuildUMDTasks = require('./build-umd');
const registerBuildESMTasks = require('./build-esm');
const registerBuildCSSTasks = require('./build-css');
const registerBuildSCSSTasks = require('./build-scss');
const registerBuildDTSTasks = require('./build-dts');

module.exports = function registerBuildTask(config) {
  registerBuildCJSTasks(config);
  registerBuildUMDTasks(config);
  registerBuildESMTasks(config);
  registerBuildCSSTasks(config);
  registerBuildSCSSTasks(config);
  registerBuildDTSTasks(config);

  gulp.task(
    'build',
    gulp.series(
      'clean',
      gulp.parallel(
        'cjs:build-production',
        'umd:build-production',
        'esm:build',
        'css:build-production',
        'scss:copy',
        'dts:copy',
      ),
    ),
  );
};
