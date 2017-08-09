var
	 gulp = require('gulp')
	, jasmine = require('gulp-jasmine')
	, reporters = require('jasmine-reporters');
	
;

var paths = {
  scripts: ['*.js', 'spec/*.js']
};

gulp.task('test', function(){
	 return gulp.src('spec/test.js')
        .pipe(jasmine());
})

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['test']);
});