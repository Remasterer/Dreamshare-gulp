const gulp = require('gulp')
,sass = require('gulp-sass')
,autoprefixer = require('gulp-autoprefixer')
,cssnano = require('gulp-cssnano')
,rename = require("gulp-rename")
,concat = require('gulp-concat')
,uglify = require('gulp-uglify')
,image = require('gulp-image')
,browser = require('browser-sync').create(),
babel = require('gulp-babel');

function browserSync(done){
    browser.init({
        server: {
            baseDir: "./build"
        },
        port:4000
    });
    done();
}
function browserSynceReloading(done){
    browser.reload();
    done();
}

const paths = {
    styles:{
        src:'app/styles/**/*.scss',
        dest:'build/css'
    },
    js:{
        src:'app/js/**/*.js',
        dest:'build/js'
    },
    images:{
        src:'app/img/**/*.*',
        dest:'build/img'
    },
    html:{
        src:'app/**/*.html',
        dest:'build'
    }
}
function styles(){
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browser.stream())
}
function html(){
    return gulp.src(paths.html.src)
            .pipe(gulp.dest(paths.html.dest))
            .pipe(browser.stream())
}
function scripts(){
    return gulp.src(paths.js.src)
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browser.stream())
}
function images(){
    return gulp.src(paths.images.src)
           .pipe(image())
           .pipe(gulp.dest(paths.images.dest))
           .pipe(browser.stream())
}
function watch(){
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.js.src, scripts)
    gulp.watch(paths.images.src, images)
    gulp.watch('./app/index.html', gulp.series(browserSynceReloading))
}

const build = gulp.parallel(styles, html, scripts,images);
gulp.task('build',build)
gulp.task('default', gulp.parallel(watch, build, browserSync));

