var gulp = require('gulp');
var jsonTransform = require('gulp-json-transform');

gulp.task('build-v3-spec', function() {
    return gulp.src('./_data/src/api-spec-v3.json')
        .pipe(jsonTransform(function(data, file) {
            return data;
        }))
        .pipe(gulp.dest('./_data'));
});