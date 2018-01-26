const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

gulp.task('default', ['browser-sync'], () => {
});

gulp.task('browser-sync', ['nodemon'], () => {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        port: 5000
	});
});

gulp.task('nodemon', (callback) => {
	let started = false;
	
	return nodemon({
		script: 'app.js'
	}).on('start', () => {
		if (!started) {
			callback();
			started = true; 
		} 
	});
});