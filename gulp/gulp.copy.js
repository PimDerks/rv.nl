var gulp = require('gulp')
    rename = require('gulp-rename');

module.exports.copyStatic = function () {

    var src = [];
        src.push(config.roots.src + '/' + config.paths.static + '/**/*'); // all assets
        src.push('!' + config.roots.src + '/' + config.paths.static + '/' + config.paths.sass); // ignore scss folder
        src.push('!' + config.roots.src + '/' + config.paths.static + '/' + config.paths.js); // ignore js folder
        src.push('!' + config.roots.src + '/' + config.paths.static + '/' + config.paths.sass + '/**/*'); // ignore scss files
        src.push('!' + config.roots.src + '/' + config.paths.static + '/' + config.paths.js + '/**/*'); // ignore js files

    var dest = config.roots.www + '/' + config.paths.static;

    return gulp.src(src)
        .pipe(gulp.dest(dest));

};

module.exports.copyMedia = function () {

    var src = config.roots.src + '/' + config.paths.media + '/**/*',
        dest = config.roots.www + '/' + config.paths.media;

    return gulp.src(src)
        .pipe(gulp.dest(dest));

};