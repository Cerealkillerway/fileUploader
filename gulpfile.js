const { series, parallel, src, dest, watch } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const del = require('del');
const uglify = require('gulp-uglify');
const merge = require('merge-stream');


// build js
function build() {
    return browserify('./js/fileUploader.js', { debug: true })
        .transform(babel)
        .bundle()
        .on('error', (error) => {
            console.error(error); this.emit('end');
        })
        .pipe(source('fileUploader.js'))
        /*.pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))*/
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
        server: '.',
        port: 7000,
        ui: {
            port: 7001
        },
        open: false
    })
};


// clean
function cleanGenerated() {
    return del([
        './dist/**/*'
    ])
};


// watch changes
function watchChanges() {
    watch('./sass/**/*.scss', series(compileSass));
    watch('./js/**/*.js', series(build));
    watch('./*.html').on('change', browserSync.reload);
    watch('./dist/js/*.js').on('change', browserSync.reload);
};


// default task: build dist
exports.default = series(cleanGenerated, build, compileSass);

// serve
exports.serve = series(cleanGenerated, compileSass, build, parallel(connect, watchChanges));
