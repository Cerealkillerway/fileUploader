const { series, src, dest, watch } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const log = require('fancy-log');
const del = require('del');
const uglify = require('gulp-uglify');
const merge = require('merge-stream');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');
const directoryExists = require('directory-exists');


// build js
function build() {
    let fileUploaderBundle = browserify('./js/fileUploader.js', { debug: true })
        .transform(babel.configure({
            presets: ['@babel/env']
        }));

    return fileUploaderBundle
        .bundle()
        .on('error', (error) => {
            console.error(error); this.emit('end');
        })
        .pipe(source('fileUploader.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./dist/js'));
};


// css
function compileSass() {
    return merge(
        src('./sass/main.scss')
            .pipe(sass({errorLogToConsole: true}))
            .pipe(dest('./dist/css'))
            .pipe(browserSync.reload({stream: true})),

        src('./sass/fileUploader.scss')
            .pipe(sass({errorLogToConsole: true}))
            .pipe(dest('./dist/css'))
            .pipe(browserSync.reload({stream: true})),
    );
};


// web server
function connect() {
    browserSync.init({
        server: '.'
    })
};


// clean
function cleanGenerated() {
    return del([
        './dist/**/*'
    ])
};


// changed
function isChanged() {
    return src('./dist/js/**')
      .pipe(gulpif(f => !f.isDirectory(), changed(destAssets, {hasChanged: changed.compareContents})))
      .pipe(gulpif(directoryExists.sync(destAssets), gulp.dest(destAssets)));
};


// watch changes
function watchChanges() {
    watch('./sass/**/*.scss', () => {
        return series(compileSass);
    });
    watch('./js/**/*.js', function() {
        return series(build, isChanged);
    });
    watch('./*.html').on('change', browserSync.reload);
    watch('./dist/js/*.js').on('change', browserSync.reload);
};


exports.default = series(cleanGenerated, build, compileSass, changed);

/*gulp.task('serve', () => {
    return runSequence('cleanGenerated', 'compileSass', 'build', 'connect', 'watchChanges');
});

gulp.task('clean', () => {
    return runSequence('cleanGenerated');
});*/
