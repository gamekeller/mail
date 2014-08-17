var gulp = require('gulp');
var premailer = require('gulp-premailer');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var htmlmin = require('gulp-htmlmin');
var del = require('del');

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('postclean', ['clean', 'html', 'assets', 'rev'], function(cb) {
  del(['build/assets/rev-manifest.json'], cb);
});

gulp.task('assets', ['clean'], function() {
  return gulp.src(['assets/**/*', '!assets/**/*.css'])
    .pipe(rev())
    .pipe(gulp.dest('build/assets'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('build/assets'));
});

gulp.task('rev', ['clean', 'html', 'assets'], function() {
  return gulp.src(['build/assets/*.json', 'build/*.html'])
    .pipe(revCollector({
      dirReplacements: {
        assets: 'https://serve.gamekeller.net/email/'
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('html', ['clean'], function() {
  return gulp.src('*.html')
    .pipe(premailer())
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('txt', ['clean'], function() {
  return gulp.src('*.txt')
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['html', 'txt', 'assets', 'rev', 'postclean']);

gulp.task('default', ['build']);