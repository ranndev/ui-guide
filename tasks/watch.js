const gulp = require('gulp');

module.exports = function registerWatchTask(config) {
  gulp.task(
    'watch',
    gulp.series(
      'clean',
      gulp.parallel(
        'cjs:build-development',
        'umd:build-development',
        'esm:build',
        'css:compile-development',
        'scss:copy',
      ),
      function watch() {
        gulp.watch(
          ['./src/**/*.ts', './typings/**/*.ts'],
          gulp.parallel(
            'cjs:bundle-development',
            'umd:build-development',
            'esm:build',
          ),
        );

        gulp.watch(
          `${config.src}/${config.name}.scss`,
          gulp.parallel('css:compile-development', 'scss:copy'),
        );
      },
    ),
  );
};
