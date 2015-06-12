// 安装插件
// sudo npm install gulp-wrapper gulp-jshint  gulp-ruby-sass gulp-concat gulp-uglify gulp-util gulp-rename gulp-cssmin gulp-imagemin gulp-replace md5-file imagemin-pngquant imagemin-jpegtran --save-dev


// 引入 gulp
var gulp = require('gulp');

// 引入组件
// var jshint      = require('gulp-jshint');
// var sass        = require('gulp-ruby-sass');
// var concat      = require('gulp-concat');
// var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var cssmin      = require('gulp-cssmin');
var imagemin    = require('gulp-imagemin');
// var replace     = require('gulp-replace');
// var gutil       = require('gulp-util');
// var livereload  = require('gulp-livereload');
// var amdOptimize = require('amd-optimize');
// var md5         = require("md5-file");
var pngquant    = require('imagemin-pngquant');
var jpegtran    = require('imagemin-jpegtran');

var paths = {
    js: [
        'js/*.js',
    ],
    img: ['img/*','html/wechat/*.png','html/wechat/*.jpg'],
    sass: 'css/_sass/*.scss',
    css: 'css/*.css',
    html: 'html/*.html'

};



// 压图
gulp.task('imgmin', function () {
     return gulp.src(paths.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(jpegtran(
            {progressive: true},
            {arithmetic: true}
        )())
        .pipe(gulp.dest('img'));
});

//css
gulp.task('sass', function() {
    gulp.src([
        'css/**/*.scss',
        '!css/**/_*.scss'
    ])
        .pipe(sass({
            includePaths: ['css']
        }))
    // .pipe(minifyCSS())
    .pipe(replace(/url\(i/g, 'url(' + project.cdnPath))
        .pipe(wrapper({
            header: '/* @update: ' + projectUtil.getNowDate() + ' */ \n'
        }))
        .pipe(gulp.dest('build/css'))
});

// html
gulp.task('html', function() {
    gulp.src([
        'html/**/*.html',
        'html/**/*.htm'
    ])
    .pipe(replace(/href="..\/css/g, 'href="' + projectUtil.getCDNpath() + '/css'))
        .pipe(replace(/src="..\/js/g, 'src="' + projectUtil.getCDNpath() + '/js'))
        .pipe(replace(/src="..\/images/g, 'src="' + projectUtil.getCDNpath() + '/images'))
        .pipe(replace(/src="..\/css/g, 'src="' + projectUtil.getCDNpath() + '/css'))
        .pipe(replace(/url\(..\/images/g, 'url(' + projectUtil.getCDNpath() + '/images'))
        .pipe(replace(/lazyload="..\/images/g, 'lazyload="' + projectUtil.getCDNpath() + '/images'))
        .pipe(gulp.dest('build/html'))
});
