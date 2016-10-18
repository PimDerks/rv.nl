var gulp = require('gulp'),
    config = require('./gulp.config');

module.exports = function(browserSync){

    return function(){

        browserSync.init({
            proxy: "localhost:4000",
            open: false,
            notify: false
        });

    }

};