var gulp = require('gulp');
var jsonTransform = require('gulp-json-transform');

var buildV3Spec = require('./src/build-v3-spec');

gulp.task('build-v3-spec', function() {
    return gulp.src('./src/_data/api-spec-v3.json')
        .pipe(jsonTransform(buildV3Spec))
        .pipe(gulp.dest('./_data'));
});