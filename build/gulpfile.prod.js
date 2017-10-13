var gulp = require('gulp');
var autoprefixer = require('autoprefixer'); // 处理css中浏览器兼容的前缀  
var rename = require('gulp-rename'); //重命名  
var cssnano = require('gulp-cssnano'); // css的层级压缩合并
var sass = require('gulp-sass'); //sass
var jshint = require('gulp-jshint'); //js检查 ==> npm install --save-dev jshint gulp-jshint（.jshintrc：https://my.oschina.net/wjj328938669/blog/637433?p=1）  
var uglify = require('gulp-uglify'); //js压缩  
var concat = require('gulp-concat'); //合并文件  
var imagemin = require('gulp-imagemin'); //图片压缩 
var htmlmin = require('gulp-minify-html'); //html压缩 
var Config = require('./gulpfile.config.js');
var pngquant = require('imagemin-pngquant');
var rev = require('gulp-rev'); // 添加版本号
var revCollector = require('gulp-rev-collector'); 
var cache = require('gulp-cache');
var del = require('del');
var sequence = require('gulp-sequence'); // 顺序执行
var htmlreplace = require('gulp-html-replace');
var flatten = require('gulp-flatten'); // 分开目录下的文件
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
var postcss =  require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var shortcss = require('postcss-short');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');
var base64 = require('gulp-base64');
//======= gulp build 打包资源 ===============
function prod() {
     // 清空builder目录
    gulp.task('clean', function () {
        return del([Config.build]);
    });
    /** 
     * HTML处理 
     */
    gulp.task('html', function () {
        return gulp
                .src([Config.html.src])// 更改版本号json文件
                .pipe(flatten())
                .pipe(htmlreplace({
                    'css': {
                        src: '/css',
                        tpl: '<link rel="stylesheet" type="text/css" href="%s/build.min.css">'
                    },
                    // 'css': ['css/build.min.css'],
                    'js': ['js/build.min.js']
                }))
                .pipe(rev())
                .pipe(gulp.dest(Config.html.builder))
                .pipe(rev.manifest('rev-html-manifest.json'))
                .pipe(gulp.dest(Config.bdrev));
    });
    // 给html文件添加版本号
    gulp.task('html2', function () {
        return gulp
                .src([Config.html.bdmanifest, Config.html.builder + '**/*.html'])// 更改版本号json文件
                .pipe(revCollector()) // 更改版本号路径
                // .pipe(htmlmin())
                .pipe(gulp.dest(Config.html.builder));
    });
    /** 
     * assets文件夹下的所有文件处理 
     */
    gulp.task('assets', function () {
        return gulp
                .src(Config.assets.src)
                .pipe(gulp.dest(Config.assets.builder));
    });
    /** 
     * CSS样式处理 
     */
    gulp.task('css', function () {
        var plug = [
            shortcss,
            cssnext,
            autoprefixer({browsers: ['> 1%','last 2 version'], cascade: false})
        ];
        return gulp
                .src(Config.css.src)
                .pipe(postcss(plug))
                .pipe(gulp.dest(Config.css.builder))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(cssnano()) //执行压缩 
                .pipe(rev())  
                .pipe(gulp.dest(Config.css.builder))
                .pipe(rev.manifest('rev-css-manifest.json'))
                .pipe(gulp.dest(Config.bdrev));
    });
    /** 
     * SASS样式处理 
     */
    gulp.task('sass', function () {
        var plug = [
            shortcss,
            cssnext,
            autoprefixer({browsers: ['> 1%','last 2 version'], cascade: false})
        ];
        return gulp
                .src(Config.sass.src)
                .pipe(base64({
                    baseDir: Config.src + '/sass',
                    extensions: ['svg', 'png', /\.jpg#datauri$/i],
                    maxImageSize: 100*1024, // bytes 
                    debug: true
                }))
                .pipe(postcss(plug))
                .pipe(sass())
                .pipe(gulp.dest(Config.sass.builder))
                .pipe(rename({
                    suffix: '.min'
                })) //rename压缩后的文件名  
                .pipe(cssnano()) //执行压缩 
                .pipe(rev())  
                .pipe(gulp.dest(Config.sass.builder))
                .pipe(rev.manifest('rev-sass-manifest.json'))
                .pipe(gulp.dest(Config.bdrev));
    });
    /** 
     * js处理 
     */
    gulp.task('js2', function () {
        return gulp
                .src(Config.js.src)
                .pipe(jshint('.jshintrc'))
                .pipe(jshint.reporter('default'))
                .pipe(babel())
                .pipe(gulp.dest(Config.js.builder+'/all'))
                .pipe(webpack({
                    output: {
                        filename: Config.build_name + '.js'
                    }
                }))
                .pipe(gulp.dest(Config.js.builder))
    });
   gulp.task('js', ['js2'], function () {
        return gulp
                .src(Config.js.build_js)
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(uglify())
                .pipe(sourcemaps.write('./map'))
                .pipe(rev())  
                .pipe(gulp.dest(Config.js.builder))
                .pipe(rev.manifest('rev-js-manifest.json'))
                .pipe(gulp.dest(Config.bdrev));
    });
    /** 
     * 合并所有js文件并做压缩处理 
     */
    /*gulp.task('js-concat', function () {
        return gulp
                .src(Config.js.src)
                .pipe(jshint('.jshintrc'))
                .pipe(jshint.reporter('default'))
                .pipe(concat(Config.js.build_name))
                .pipe(gulp.dest(Config.js.builder))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(uglify())
                .pipe(rev()) 
                .pipe(gulp.dest(Config.js.builder))
                .pipe(rev.manifest('rev-all-js-manifest.json'))
                .pipe(gulp.dest(Config.bdrev));
    });*/
    /** 
     * 合并所有css文件并做压缩处理 --未应用
     */
    gulp.task('css-concat',['sass','css'], function () {
        return gulp
                .src([Config.build + 'css/**/*.css','!'+Config.build + 'css/**/*.min.css'])
                .pipe(concat(Config.build_name + '.css'))
                .pipe(gulp.dest(Config.css.builder))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(cssnano())
                .pipe(rev()) 
                .pipe(gulp.dest(Config.css.builder))
                .pipe(rev.manifest('rev-all-css-manifest.json'))
                .pipe(gulp.dest(Config.bdrev));
    });
    /** 
     * 图片处理 
     */
    gulp.task('images', function () {
        return gulp.src(Config.img.src).pipe(cache(imagemin({
                    optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
                    svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
                    use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
                })))
                .pipe(gulp.dest(Config.img.builder));
    });
    gulp.task('build', function(cb){
        sequence('clean',['js', 'assets', 'images', 'css-concat', 'html'], 'html2')(function(){
            browserSync.init({
                server: {
                    baseDir: Config.build
                }
                , notify: false
                , port: 8090 // 默认3000
            });
        })
    })
}
module.exports = prod;