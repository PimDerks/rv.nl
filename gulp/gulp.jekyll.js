var gulp = require('gulp'),
    path = require('path'),
    config = require('./gulp.config'),
    utils = require('./gulp.utils'),
    fs = require('fs'),
    fse = require('fs-extra'),
    htmlhint = require("gulp-htmlhint"),
    w3cjs = require('gulp-w3cjs'),
    util = require('gulp-util'),
    through2 = require('through2');

module.exports.copy = function(){

    var spawn = require('child_process').spawn;
    var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});

};

var ignoredErrors = [];
ignoredErrors.push('A “meta” element with an “http-equiv” attribute whose value is “X-UA-Compatible” must have a “content” attribute with the value “IE=edge”.');

module.exports.lint = function(){
    return gulp.src(config.roots.www + '/**/*.html')
        .pipe(w3cjs())
        .pipe(through2.obj(function(file, enc, cb){
            cb(null, file);
            if (!file.w3cjs.success){
                file.w3cjs.messages.forEach(function(m){
                    if(ignoredErrors.indexOf(m.message) === -1){
                        console.log(m.message + ': ' + m.extract);
                    }
                });
            }
        }))
        .pipe(htmlhint())
        .pipe(htmlhint.failReporter());
};

module.exports.watch = function(){

    var src = [];

    // swig
    src.push(config.roots.src + '/**/*.html');
    src.push(config.roots.src + '/**/*.md');

    var tasks = ['output-html'];
    if(!util.env.killlint) {
        tasks.push('lint-html');
    }

    // watch data
    gulp.watch(src, tasks);

};