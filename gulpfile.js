// 安装插件
// sudo npm install gulp-wrapper browser-sync gulp-jshint  gulp-ruby-sass gulp-concat gulp-uglify gulp-util gulp-rename gulp-cssmin gulp-imagemin gulp-replace md5-file imagemin-pngquant imagemin-jpegtran --save-dev


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
//向文件插入代码
var wrapper = require('gulp-wrapper');
//自动刷新
var sync = require('browser-sync');


var paths = {
    js: [
        'js/*.js',
    ],
    img: ['img/*','html/wechat/*.png','html/wechat/*.jpg'],
    sass: 'css/_sass/*.scss',
    css: 'css/*.css',
    html: 'html/*.html'

};

// 检查js语法
gulp.task('lint', function() {
    gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 编译Sass
gulp.task('sass', function() {
    return sass('css/_sass/',{style: 'compressed'})
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest('css'));
});


// 压缩合并js
gulp.task('jsmin', function() {
    gulp.src('js/main.js')
        // .pipe(concat('all.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('js'));
});

//  压缩合并css
gulp.task('cssmin', function () {
    gulp.src(paths.css)
        .pipe(concat('all.css'))
        .pipe(cssmin())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('css'));
});

// 发布
gulp.task('pub', function(){
    gulp.run('imgmin', 'sass', 'jsmin')

});

// js 加md5版本号
gulp.task('watchjs', function(){
    gulp.watch(paths.js, function(){
        var localFilePath = arguments[0].path;//获取修改的本地文件名
        var fileMd5 = md5(localFilePath); //获取文件md5
        var fileName = localFilePath.match(/([^\\]+?(js|css))/g)[1];//得到文件名
        // console.log('===========', localFilePath, fileName, fileMd5);
        var js_r = new RegExp('(<script\\s+data\-main\\s*=\\s*[\'\"])(' + '.+' + fileName + ')(\\?.*)(".*?\<\/script\>)')
        gulp.src(paths.html) //遍历所有文件查看引用
            .pipe(replace(js_r,'$1$2'+'?v='+fileMd5+'\"'+' src=\"\.\.\/jsmin\/lib\/require\.js'+'$4'))
            .pipe(gulp.dest('html/'))
        console.log('chage js md5');
    })
});

// css 加md5版本号
gulp.task('watchcss', function(){
    gulp.watch(paths.css, function(){
        var localFilePath = arguments[0].path;//获取修改的本地文件名
        var fileMd5 = md5(localFilePath); //获取文件md5
        var fileName = localFilePath.match(/([^\\]+?(css))/g)[1];//得到文件名
        // console.log('===========', localFilePath, fileName, fileMd5);

        var css_r = new RegExp('(<link\\s+href\\s*=\\s*[\'\"])(' + '.+' + fileName + ')(\\?.*)?' + '([\'\"].+)')//正则，匹配<link>标签
        gulp.src(paths.html) //遍历所有文件查看引用
            .pipe(replace(css_r,'$1$2'+'?v='+fileMd5+'\"'+' type=\"text\/css\" rel=\"stylesheet'+'$4'))//如果有引用，则加入md5 hash
            .pipe(gulp.dest('html/'))
            console.log('chage css md5');
    })
});

// 默认任务
gulp.task('default', function(){
    var js = ['lint', 'watchjs'];
    var sass = ['sass'];
    var css = ['watchcss'];
    // gulp.watch(paths.js, ['lint', 'watchjs']);
    // gulp.watch(paths.js, ['lint']);
    gulp.watch(paths.sass, sass);
    // gulp.watch(paths.css, css);
});

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

//高
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
