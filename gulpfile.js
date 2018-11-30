var gulp = require('gulp');
var jsonTransform = require('gulp-json-transform');
var buildV3 = require('./src/_data/build-v3');

gulp.task('build-v3-spec', function() {
    return gulp.src('./src/_data/api-spec-v3.json')
        .pipe(jsonTransform(buildV3))
        .pipe(gulp.dest('./_data'));
});