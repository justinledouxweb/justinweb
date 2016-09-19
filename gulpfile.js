const gulp = require('gulp');
const sourcemap = require('gulp-sourcemaps');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const stringify = require('stringify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', ['script']);
  gulp.watch('src/**/*.html', ['script']);
  gulp.watch('src/**/*.sass', ['style']);
  gulp.watch('src/styles/bootstrap.less', ['bootstrap']);
  gulp.watch('src/app/index.html', ['html']);
});

gulp
  .task('script', ['html'], () => browserify({
    entries: ['./src/app/app.js'],
    debug: true,
  })
  .transform(stringify, {
    appliesTo: { includeExtensions: ['.html'] },
    minigy: true,
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  // .pipe(sourcemap.init())
  .pipe(uglify())
  // .pipe(sourcemap.write('./'))
  .pipe(gulp.dest('public/js')));

gulp.task('bootstrap', () => gulp.src('./src/styles/bootstrap.less')
  .pipe(less())
  .pipe(cleanCSS({ debug: true }, (details) => {
    console.log(`${details.name}: ${details.stats.originalSize}`);
    console.log(`${details.name}: ${details.stats.minifiedSize}`);
  }))
  .pipe(gulp.dest('public/css')));

gulp.task('style', ['bootstrap'], () => gulp.src('./src/app/app.sass')
  // .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ debug: true }, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
  // .pipe(sourcemap.write())
  .pipe(gulp.dest('public/css')));

gulp.task('html', () => gulp.src('./src/app/index.html')
  .pipe(gulp.dest('public')));

gulp.task('all', ['bootstrap', 'style', 'html', 'script']);
















