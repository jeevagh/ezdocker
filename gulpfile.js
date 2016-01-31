(function() {
  'use strict';

  var del = require('del'),
      gulp = require('gulp'),
      jspm = require('gulp-jspm'),
      babel = require('gulp-babel'),
      mocha = require('gulp-mocha'),
      istanbul = require('gulp-istanbul'),
      coveralls = require('gulp-coveralls'),
      sourcemaps = require('gulp-sourcemaps');

  /* Require this to ensure that mocha runs using es6 */
  require('babel-core/register');

  gulp.task('clean', function() {
    return del(['build']);
  });

  gulp.task('dist-clean', function() {
    return del(['dist']);
  });

  gulp.task('build', function() {
    return gulp.src(['src/ezdocker.js', 'src/tar-utils.js'])
      .pipe(sourcemaps.init())
        .pipe(babel())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('test:build', function() {
    return gulp.src(['src/*.js', 'src/*.js'])
      .pipe(sourcemaps.init())
        .pipe(babel())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/es5'));

  });

  gulp.task('test:instrument', ['test:build'], function() {
    return gulp.src(['build/es5/ezdocker.js', 'build/es5/tar-utils.js'])
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());
  });

  gulp.task('test', ['test:instrument'], function() {
    return gulp.src('build/es5/*.js')
      .pipe(mocha())
      .pipe(istanbul.writeReports({
        dir: './build/coverage',
        reporters: ['lcovonly', 'html', 'text-summary']
      }));
  });

  gulp.task('ci', [ 'test' ], function() {
    return gulp.src('build/coverage/lcov.info')
      .pipe(coveralls());
  });

})();