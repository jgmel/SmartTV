/**
 * Created by strobil on 17.11.16.
 */
"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    http = require('http'),
    st = require('st'),
    strip = require('gulp-strip-comments'),
    minify = require('gulp-minify');

gulp.task('js', function () {
    gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/underscore/underscore-min.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'src/js/modules/*.js',
        'src/js/apps/*.js',
        'src/js/directives/*.js',
        'src/js/controllers/*.js',
        'src/js/services/*.js',
        'src/js/components/*.js',
        'src/js/custom/*.js'
    ])
        .pipe(strip())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/js/'))
        .pipe(livereload());
});

gulp.task('css', function () {
    gulp.src([
        'bower_components/font-awesome/css/font-awesome.css',
        'dist/css/*/*.css',
        'src/css/*.css'
    ])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('app/css/'))
        .pipe(livereload());
});

gulp.task('watch', ['server'], function () {
    livereload.listen({basePath: 'app'});

    gulp.watch(['app/index.html', 'app/templates/*.html', 'app/templates/*/*.html']).on("change", livereload.reload);
    gulp.watch('src/css/*.css', ['css']);
    gulp.watch(['src/js/*/*.js', 'dist/*/*.js'], ['js']);
});

gulp.task('server', function (done) {
    http.createServer(
        st({path: __dirname + '/app', index: 'index.html', cache: false})
    ).listen(8080, done);
});

gulp.task('default', ['js', 'css', 'watch']);