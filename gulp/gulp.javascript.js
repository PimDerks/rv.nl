var gulp = require('gulp'),
    rename = require('gulp-rename');
    sourcemaps = require('gulp-sourcemaps'),
    config = require('./gulp.config'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    util = require('gulp-util');

module.exports.copy = function(){

    var src = [];
        src.push(config.roots.src + '/**/*.js');
        // src.push('!' + config.roots.src + '/**/*Spec.js');

    var dest = config.roots.www;

    // all files in root of /scss/
    return gulp.src(src)
        .pipe(gulp.dest(dest));

};

module.exports.watch = function() {

    var tasks = ['output-js'];
    if(!util.env.killlint) {
        tasks.push('lint-js');
    }

    // Watch js files. Tasks are defined in the main gruntfile.
    gulp.watch(config.roots.src + '/**/*.js', tasks);

};

module.exports.lint = function(){

    var src = [];
    src.push(config.roots.src + config.paths.js + '/**/*.js');

    return gulp.src(src)
        .pipe(jscs({}))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

};