var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var newer = require('gulp-newer');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var imagemin = require('gulp-imagemin');
var include = require('gulp-include');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var browserSync = require('browser-sync');
var ghPages = require('gulp-gh-pages');

const config = {
	isProduction: process.env.NODE_ENV === 'production',
	version: require('./package.json').version,
	paths: {
		src: {
			views: './src/views/*.pug',
			styles: './src/styles/*.styl',
			fonts: './src/fonts/**/*.*',
			images: './src/images/**/*.*',
			scripts: './src/scripts/'
		},
		dest: {
			root: './build/',
			views: './build/',
			styles: './build/assets/css/',
			fonts: './build/assets/fonts/',
			images: './build/assets/img',
			scripts: './build/assets/js/'
		},
		watch: {
			views : './src/views/**/*.*',
			styles : './src/styles/**/*.*',
			fonts : './src/fonts/**/*.*',
			images : './src/img/**/*.*',
			scripts: './src/scripts/**/*.*'
		}
	}
};

const rootDir = config.paths.dest.root;

const bs = browserSync.create();
var bsConfig = {
	server: {
		baseDir: rootDir
	},
	files: rootDir + '**/*.*',
	host: 'localhost',
	port: 3000,
	notify: true,
	injectChanges: true,
	open: true,
	tunnel: false
};


function plumberHandler() {
	return plumber({
		errorHandler: function (err) {
			console.error(err);
			this.emit('end');
		}
	});
};


gulp.task('fonts', () => {
	return gulp.src(config.paths.src.fonts)
		.pipe(plumberHandler())
		.pipe(newer(config.paths.dest.fonts))
		.pipe(gulp.dest(config.paths.dest.fonts))
});


gulp.task('images', () => {
	return gulp.src(config.paths.src.images)
		.pipe(plumberHandler())
		.pipe(newer(config.paths.dest.images))
		.pipe(imagemin())
		.pipe(gulp.dest(config.paths.dest.images));
});


gulp.task('views', () => {
	return gulp.src(config.paths.src.views)
		.pipe(plumberHandler())
		.pipe(pug({
			locals: Object.assign({}, {
				version: config.version,
				isProduction: config.isProduction
			})
		}))
		.pipe(gulp.dest(config.paths.dest.views))
});


gulp.task('scripts', () => {
	return gulp.src(config.paths.src.scripts + '*.js')
		.pipe(plumberHandler())
		.pipe(include({
			extensions: 'js',
			hardFail: false,
			includePaths: [
				__dirname + '/node_modules',
				__dirname + '/' + config.paths.src.scripts
			]
		}))
		.pipe(gulpIf(config.isProduction, uglify(), gutil.noop()))
		.pipe(gulp.dest(config.paths.dest.scripts));
});

function sortMediaQueries(a, b) {
	let A = a.replace(/\D/g, '');
	let B = b.replace(/\D/g, '');

	if (isMax(a) && isMax(b)) {
		return B - A;
	} else if (isMin(a) && isMin(b)) {
		return A - B;
	} else if (isMax(a) && isMin(b)) {
		return 1;
	} else if (isMin(a) && isMax(b)) {
		return -1;
	}

	return 1;
};

function isMax(mq) {
	return /max-width/.test(mq);
}

function isMin(mq) {
	return /min-width/.test(mq);
}

const postcssplugins = [
	require('autoprefixer')({
		browsers: ['>1%', 'last 4 version', 'ie 9', 'ie 10', 'ie 11']
	}),
	require('css-mqpacker')({
		sort: sortMediaQueries
	})
].concat(
	config.isProduction
	? [
		require('postcss-csso')({
			restructure: false,
			comments: false
		})
	]
	: []
);

gulp.task('styles', () => {
	return gulp.src(config.paths.src.styles)
		.pipe(plumberHandler())
		.pipe(sourcemaps.init())
		.pipe(stylus({
			paths:  [
				'node_modules'
			],
			'include css': true
		}))
		.pipe(postcss(postcssplugins))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.paths.dest.styles));
});


gulp.task('server', () => {
	return bs.init(Object.assign(Object.create(null), bsConfig || {}));
});


gulp.task('deploy', function() {
	return gulp.src(rootDir + '**/*.*')
		.pipe(ghPages());
});


gulp.task('watch', () => {
	var paths = config.paths.watch;
	Object.keys(paths)
		.forEach((path) => {
			gulp.watch(paths[path], [path]);
		});
});

gulp.task('build', ['fonts', 'images', 'styles', 'scripts', 'views']);
gulp.task('default', ['build', 'watch', 'server']);
