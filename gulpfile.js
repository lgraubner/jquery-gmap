const gulp = require('gulp');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const pkg = require('./package.json');

const pluginName = pkg.name.replace(/-/g, '.');

const banner = `/**
 * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>
 * Copyright ${new Date().getFullYear()} <%= pkg.author.name %> - <%= pkg.homepage %>
 * License: <%= pkg.license %>
 */\n`;

gulp.task('build', ['lint'], () => {
  return gulp.src(`src/${pluginName}.js`)
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('lint', () => {
  return gulp.src('src/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['build']);
