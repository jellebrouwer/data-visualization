var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var del = require('del');
var vendor = [
    'node_modules/angular/angular.js',
    'node_modules/angular-route/angular-route.js',
    'node_modules/d3/build/d3.js',
    'node_modules/topojson/dist/topojson.js'
];
var app = [
    'src/js/app.js',
    'src/js/**/*.js'
];
var dest = 'build';

gulp.task('clean', function () {
    return del([dest]);
});

gulp.task('js-vendor', function () {
    return gulp.src(vendor)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
});

gulp.task('js-app', function () {
    return gulp.src(app)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('visualization.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
});

gulp.task('build', ['clean', 'js-vendor', 'js-app', 'sass']);

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js-app', 'sass'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('sass', function () {
    return gulp.src('src/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dest));
});

gulp.task('serve', ['build'], function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch(app, ['js-watch']);
    gulp.watch('src/**/*.html', ['js-watch']);
    gulp.watch('src/**/*.scss', ['js-watch']);
});