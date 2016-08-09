var gulp       = require('gulp'),
    fs         = require('fs'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function () {

    var config  = JSON.parse(fs.readFileSync('package.json', 'utf8')),
        version = config.version.split('.');

    version = version[0] + '.' + version[1];

    return gulp.src('source/*')
        .pipe(sourcemaps.init())
        .pipe(concat('astrobasic-' + version + '.js'))
        .pipe(gulp.dest('build'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));
});