var gulp = require('gulp');
var gulpLoadPlugins=require('gulp-load-plugins');
var plugins=gulpLoadPlugins();
var autoprefixer = require('autoprefixer'); // 处理css中浏览器兼容的前缀  
var rename = plugins.rename; //重命名  
var cssnano = plugins.cssnano; // css的层级压缩合并
var sass = plugins.sass; //sass
var jshint = plugins.jshint; //js检查 ==> npm install --save-dev jshint gulp-jshint（.jshintrc：https://my.oschina.net/wjj328938669/blog/637433?p=1）  
var concat = plugins.concat; //合并文件  
var imagemin = plugins.imagemin; //图片压缩 
var cache = plugins.cache; //只压缩修改的图片，没有修改的图片直接从缓存文件读取
var rev = plugins.rev; // 添加版本号
var revCollector = plugins.revCollector;  // 更改版本号路径
var sequence = plugins.sequence; // 顺序执行
var del = require('del');
var pngquant = require('imagemin-pngquant'); // 使用pngquant深度压缩png图片的imagemin插件
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var base64 = plugins.base64;
var babel = plugins.babel;
var webpack = plugins.webpack;
var flatten =  plugins.flatten; // 分开目录下的文件
var postcss =  plugins.postcss;
var changed =  plugins.changed; //之编译改变的文件
var sourcemaps = plugins.sourcemaps;
var cssnext = require('postcss-cssnext');
var shortcss = require('postcss-short');
var Config = require('./gulpfile.config.js');
var handleErrors = require('../util/handleErrors.js');
//======= gulp dev 开发环境下 ===============
function dev() {
    // 清空dist目录
    gulp.task('clean:dev', function () {
        return del([Config.dist, Config.build, Config.bdrev]);
    });
    /** 
     * assets文件夹下的所有文件处理 
     */
    gulp.task('assets:dev', function () {
        return gulp
        		.src(Config.assets.src)
                //.pipe(changed(dist,{extension:'.js'}))
                .pipe(changed(Config.assets.dist))
        		.pipe(gulp.dest(Config.assets.dist))
        		.pipe(reload({
		            stream: true
		        }));
    });
    /** 
     * CSS样式处理 
     */
    gulp.task('css:dev', function () {
        return gulp
        		.src(Config.css.src)
                .pipe(rev())     
        		.pipe(gulp.dest(Config.css.dist))
                .pipe(rev.manifest('rev-css-manifest.json'))
                .pipe(gulp.dest(Config.rev))
        		.pipe(reload({
		            stream: true
		        }));
    });
    /** 
     * SASS样式处理 
     */
    gulp.task('sass:dev', function () {
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
                    maxImageSize: 100*1024, // 小于100kb转码
                    debug: true
                }))
        		.pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(postcss(plug)) // 放到编译后面，否则可能报错
                .on('error', handleErrors)     //交给notify处理错误
                .pipe(sourcemaps.write('./map/'))
                .pipe(rev())   
        		.pipe(gulp.dest(Config.sass.dist))
                .pipe(rev.manifest('rev-scss-manifest.json'))
                .pipe(gulp.dest(Config.rev))
        		.pipe(reload({
		            stream: true
		        }));
    });
    /** 
     * js处理 
     */
    gulp.task('js:dev', function () {
        return gulp
        		.src([Config.js.src])
        		// .pipe(jshint('.jshintrc'))
        		.pipe(jshint.reporter('default'))
                .pipe(babel())
        		.pipe(gulp.dest(Config.js.dist))
                .on('error', handleErrors)     //交给notify处理错误
                .pipe(webpack({
                    output: {
                        filename: Config.build_name + '.js'
                    }
                }))
                .pipe(gulp.dest(Config.js.dist))
        		.pipe(reload({
		            stream: true
		        }));
    });
    /**
    图片base64处理
    */
    // gulp.task('base64', function(){
    //     return gulp.src(Config.css.dist+'/**/*.css')
    //     .pipe(base64({ 
    //         baseDir: Config.css.dist, 
    //         extensions: ['svg', 'png', /\.jpg#datauri$/i], 
    //         maxImageSize: 100 * 1024, //小于100KB的PNG
    //         debug: false 
    //     }))
    //     .pipe(gulp.dest(Config.css.dist))
    //     .pipe(reload({
    //         stream: true
    //     }));
    // })
    /** 
     * 图片处理 
     */
    gulp.task('images:dev', function () {
        return gulp.src(Config.img.src)
                .pipe(cache(imagemin({
                    optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
                    svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
                    use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
                })))
                .pipe(gulp.dest(Config.img.dist))
                .pipe(reload({
                    stream: true
                }));
    });

     /** 
     * HTML处理 
     */
    gulp.task('html:dev', function () {
        return gulp
                .src([Config.html.manifest, Config.html.src, "!" + Config.assets.srcc])// 更改版本号json文件
                .pipe(flatten())
                .pipe(revCollector()) // 更改版本号路径
                .pipe(gulp.dest(Config.html.dist))
                .pipe(reload({
                    stream: true
                }));
    });

    gulp.task('dev', function(cb){
        sequence('clean:dev', ['css:dev', 'sass:dev', 'js:dev', 'assets:dev', 'images:dev', 'html:dev'])(function(){
            browserSync.init({
                server: {
                    baseDir: Config.dist
                }
                , notify: false
                , port: 8000 // 默认3000
            });
            // Watch .css files  
            gulp.watch(Config.css.src, ['css:dev']);
            // Watch .scss files  
            gulp.watch(Config.sass.src, ['sass:dev']);
            // Watch assets files  
            gulp.watch(Config.assets.src, ['assets:dev']);
            // Watch .js files  
            gulp.watch(Config.js.src, ['js:dev']);
            // Watch image files  
            gulp.watch(Config.img.src, ['images:dev']);
            // Watch .html files  
            gulp.watch(Config.html.src, ['html:dev']);
        })
    })
   /* gulp.task('dev', ['css:dev', 'sass:dev', 'js:dev', 'assets:dev', 'images:dev', 'html:dev'], function (done) {
            browserSync.init({
                server: {
                    baseDir: Config.dist
                }
                , notify: false
                , port: 8000 // 默认3000
            });
            // Watch .css files  
            gulp.watch(Config.css.src, ['css:dev']);
            // Watch .scss files  
            gulp.watch(Config.sass.src, ['sass:dev']);
            // Watch assets files  
            gulp.watch(Config.assets.src, ['assets:dev']);
            // Watch .js files  
            gulp.watch(Config.js.src, ['js:dev']);
            // Watch image files  
            gulp.watch(Config.img.src, ['images:dev']);
            // Watch .html files  
            gulp.watch(Config.html.src, ['html:dev']);
        });*/
}
//======= gulp dev 开发环境下 ===============
module.exports = dev;