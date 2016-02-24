var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();

//JS linting Task
gulp.task('jshint', function() {
  return gulp.src('site/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Compile SASS Task
gulp.task('sass', function(){
  return gulp.src('site/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('site/css'))
    .pipe(browserSync.stream());
});

//Minify index
gulp.task('html', function(){
  return gulp.src('site/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('build/'));
});

//Javascript build task, removes whitespace and concatenates all files
gulp.task('scripts', function(){
  return browserify('site/js/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

//Styles build task, concatenates all the files
gulp.task('styles', function(){
  return gulp.src('site/css/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/css'));
});

//Image Optimization Task
gulp.task('images', function(){
  return gulp.src('site/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
});

//Live browser refresh
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./site"
    });

    gulp.watch("site/*.html").on('change', browserSync.reload);
    gulp.watch('site/js/*.js', ['jshint', browserSync.reload]);
    gulp.watch('site/scss/*.scss', ['sass']);
});



//Default Task
gulp.task('default', ['jshint', 'sass', 'serve']);

//Build Task
gulp.task('build', ['jshint', 'sass', 'html', 'scripts', 'styles', 'images']);
