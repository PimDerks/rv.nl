var gulp = require('gulp'),
    config = require('./gulp.config');

module.exports = function(browserSync){

    return function(){

        browserSync.init({
            proxy: "localhost:4001",
            open: false,
            notify: false
        });

    }

};