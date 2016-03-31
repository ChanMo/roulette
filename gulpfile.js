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

gulp.task('sass', function(){
    return gulp.src('app/scss/*.scss')
        .pipe(sass({
            includePaths: [
              'bower_components/foundation-sites/scss',
              'bower_components/font-awesome/scss'
            ]
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function(){
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function(){
    return del.sync('dist');
});


/** build task **/
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('nunjucksRender', function(){
    return gulp.src(['app/html/*.html', 'app/template/*.html'])
        .pipe(nunjucksRender({
            path: ['app/template/']
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('default', ['sass', 'js', 'nunjucksRender', 'browserSync'], function(){
    console.log('Hello Chen');
    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/js/*.js', ['js']);
    gulp.watch('app/**/*.html', ['nunjucksRender']);
});

gulp.task('build', ['clean', 'sass', 'nunjucksRender', 'useref', 'images', 'fonts'], function(){
    console.log('Building files...');
});
