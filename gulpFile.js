/*jslint nomen: true, unparam: true */
/*global require, console */

(function () {
    'use strict';

    var gulp = require('gulp'),
        uglify = require('gulp-uglify'),
        gutil = require('gulp-util'),
        concat = require('gulp-concat'),
        mincss = require('gulp-minify-css'),
        del = require('del');

    gulp.task('scripts', function () {
        return gulp.src(['app/**/*.js'])
            .pipe(uglify())
            .pipe(concat('app.js'))
            .pipe(gulp.dest('build'));
    });

    gulp.task('styles', function () {
        return gulp.src(['css/**/*.css'])
            .pipe(mincss())
            .pipe(concat('app.css'))
            .pipe(gulp.dest('build'));
    });

    gulp.task('html', function () {
        return gulp.src(['index.html', 'app/**/*.html'])
            .pipe(concat('app.html'))
            .pipe(gulp.dest('build'));
    });

    gulp.task('clean', function (cb) {
        del(['build/**/*'], cb);
    });

    gulp.task('default', ['clean', 'scripts', 'styles', 'html'], function () {
        gutil.log('\nUpdated the \'build\' directory. To publish:');
    });

})();