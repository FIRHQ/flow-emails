var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var inlineCss = require('gulp-inline-css');
var nconf = require('nconf');

nconf.env().argv();

var template = nconf.get('template');

gulp.task('clean', function () {
  return gulp.src('./dist/*').pipe(clean());
});

gulp.task('template', function () {
  try {
    fs.statSync(path.join(__dirname, `./emails/${template}.jade`));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  var locals = nconf.get();
  gulp.src(`./emails/${template}.jade`)
    .pipe(jade({ locals: locals }))
    .pipe(rename('email.html'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('inline-css', function () {
  return gulp.src('./dist/*.html')
      .pipe(inlineCss())
      .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['clean', 'template', 'inline-css']);
