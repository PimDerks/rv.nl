var gulp = require('gulp'),
    config = require('./gulp/gulp.config'),
    bs = require('browser-sync').create(),
    seq = require('run-sequence'),
    exec = require('child_process').exec;

// require
var clean = require('./gulp/gulp.clean'),
    concat = require('./gulp/gulp.concat'),
    inline = require('./gulp/gulp.inline'),
    watchWWW = require('./gulp/gulp.watchWWW')(bs),
    sass = require('./gulp/gulp.sass'),
    minify = require('./gulp/gulp.minify'),
    base64 = require('./gulp/gulp.base64'),
    copy = require('./gulp/gulp.copy'),
    ftp = require('./gulp/gulp.ftp'),
    browserSync = require('./gulp/gulp.browsersync')(bs),
    js = require('./gulp/gulp.javascript'),
    jekyll = require('./gulp/gulp.jekyll');

// Linting
gulp.task('lint-sass', sass.lint);
gulp.task('lint-js', js.lint);
gulp.task('lint-html', jekyll.lint);
gulp.task('lint', ['lint-sass', 'lint-js']);

// Outputting DEV
gulp.task('output-js', js.copy);
gulp.task('output-sass', sass.copy);
gulp.task('output-html', jekyll.copy);
gulp.task('output', ['output-js', 'output-sass', 'output-html']);

// Copy task
gulp.task('copy-static', copy.copyStatic);
gulp.task('copy-media', copy.copyMedia);
gulp.task('copy', ['copy-static', 'copy-media']);

// Watching DEV
gulp.task('watch-js', js.watch);
gulp.task('watch-sass', sass.watch);
gulp.task('watch-html', jekyll.watch);
gulp.task('watch-www', watchWWW);
gulp.task('watch', ['watch-js', 'watch-sass', 'watch-html']);

// Automatically update files in browser
gulp.task('browser-sync', browserSync);

// Remove temp/www dir
gulp.task('clean', clean);

// Concat shims
gulp.task('shim', concat.shim);

// Inline assets
// gulp.task('inline', inline);

// Inline assets
// gulp.task('base64', base64);

// Minify CSS, JS and images
// gulp.task('minify-css', minify.minifyCSS);
// gulp.task('minify-js', minify.minifyJS);
// gulp.task('minify-img', minify.minifyImg);
// gulp.task('minify', ['minify-css', 'minify-js', 'minify-img', 'copy-unminified']);

// Deploy
// gulp.task('deploy', ftp);

/*
 *
 * Shortcuts. These are the tasks you should use.
 *
 */

// Initial build. Run this once before starting development.

gulp.task('initial', function() {

    seq('clean', 'output-js', 'output-sass', 'output-html', 'shim', 'copy-static', 'copy-media', function(){
        console.log("Initial task finished. Now run 'gulp dev' to start developing.");
    });

});

// Run this when you want to start developing.

gulp.task('dev', function() {
    seq('initial', 'watch', 'browser-sync');
});

// Build project

gulp.task('build', function() {
    // seq('copy-www-static', 'copy-www-media', 'minify', 'inline', 'base64', function(){
        // process.exit(0);
    // });
});

// Test and lint code. Please note that the test-js task runs on the /www/ folder (for now).

gulp.task('test', function() {
    seq('lint', function(){
        console.log('Test completed.');
        process.exit(0);
    });
});
