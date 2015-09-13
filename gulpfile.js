"use strict";

var gulp = require('gulp');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var concatcss = require('gulp-concat-css');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var source = require('vinyl-source-stream');
var multiGlob = require('multi-glob');
var browserSync = require('browser-sync').create();
var rimraf = require('rimraf');
var path = require('path');
var elm = require('gulp-elm');
var chokidar = require('chokidar');

var config = {
	"src": "./src",
	"development": "./development",
	"dist": "./dist",
	"vendor": "./vendor",
	"spec": "./spec"

};

gulp.task('clean-dev', function(cb) {
	clean(config.development, cb);
});

gulp.task('copy-all-files', function(cb) {
	runSequence('copy-elm', 'copy-style', 'copy-html', cb);
});

gulp.task('elm-init', elm.init);

gulp.task('copy-elm', ['elm-init'], function() {
	return gulp.src(config.src + '/app/*.elm')
		.pipe(elm())
		.pipe(gulp.dest(config.development))
		.pipe(browserSync.stream())
		.on('end', function() {
			gutil.log('successfully copied elm files');
		});
});


gulp.task('copy-style', function() {
	var newStyles = [config.src].map(function(cssPath) {
		return path.join(cssPath, '/**/*.{css,scss}');
	});
	gulp.src(newStyles)
		.pipe(sass())
		.pipe(concatcss('app.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.development))
		.pipe(browserSync.stream())
		.on('end', function() {
			gutil.log('successfully copied css files');
		})
		.on('error', function(err) {
			gutil.log(err);
		});
});

gulp.task('copy-html', function() {
	gulp.src(config.src + "/index.html")
		.pipe(gulp.dest(config.development))
		.pipe(browserSync.stream())
		.on('end', function() {
			gutil.log('successfully copied index.html');
		})
		.on('error', function(err) {
			gutil.log(err);
		});
});

gulp.task('prepare-dev', ['clean-dev'], function(cb) {
	runSequence('copy-all-files', cb);
});

gulp.task('watch', function() {
	watcher([config.src, config.spec], function() {
		gulp.start('prepare-dev');
	});
});

gulp.task('default', function(cb) {
	browserSync.init({
		server: config.development
	});
	runSequence('prepare-dev', 'watch', cb);
});

function clean(globFolder, cb) {
	rimraf(globFolder, cb);
}

function watcher(fileOrDirectory, callBack) {
	return chokidar.watch(fileOrDirectory, {ignored: /[\/\\]\./, ignoreInitial: true})
		.on('add', function() {
			console.log("Event:ADD");
			callBack();
		})
		.on('change', function() {
			console.log("Event:CHANGE");
			callBack();
		})
		.on('unlink', function() {
			console.log("Event:DELETE");
			callBack();
		})
		.on('error', function(error) {
			console.error('Error happened', error);
		})
}
