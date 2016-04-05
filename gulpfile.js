/**
 * my gulp file
 * @author chen
 * @email chen.orange@aliyun.com
 * @website http://findchen.com
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var nunjucksRender = require('gulp-nunjucks-render');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var del = require('del');

/** sass **/
gulp.task('sass', function(){
    return gulp.src('app/scss/*.scss')
        .pipe(sass({
            includePaths: [
              'bower_components/foundation-sites/scss',
              'bower_components/motion-ui/src',
              'bower_components/font-awesome/scss'
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}));
});

/** js **/
gulp.task('js', function(){
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({stream:true}));
});

/** images **/
gulp.task('images', function(){
    return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

/** fonts **/
gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

/** clean for build **/
gulp.task('clean', function(){
    return del.sync('dist');
});


/** useref **/
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

/** nunjucksRender **/
gulp.task('nunjucksRender', function(){
    return gulp.src(['app/html/*.html'])
        .pipe(nunjucksRender({
            path: ['app/template/']
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream:true}));
});

/** browserSync **/
gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

/** default **/
gulp.task('default', ['sass', 'js', 'nunjucksRender', 'browserSync'], function(){
    console.log('Hello Chen');
    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/js/*.js', ['js']);
    gulp.watch('app/**/*.html', ['nunjucksRender']);
});

/** build **/
gulp.task('build', ['clean', 'sass', 'nunjucksRender', 'fonts', 'images', 'useref'], function(){
    console.log('Building files...');
});
