var SRC_DIR = './src/';     // 源文件目录  
var DIST_DIR = './dist/';   // 文件处理后存放的目录  
var REV_DIR = './rev/';   // 版本号rev生成的.json目录
var BDREV_DIR = './build_rev/';   // 版本号rev生成的.json目录
var BUILD_DIR = './builder/';   // 生产环境下文件处理后存放的目录  
var DIST_FILES = DIST_DIR + '**'; // 目标路径下的所有文件  
var BUILD_NAME = 'build';
var Config = {
    src: SRC_DIR,
    dist: DIST_DIR,
    build: BUILD_DIR,
    rev: REV_DIR,
    bdrev: BDREV_DIR,
    dist_files: DIST_FILES,
    build_name: BUILD_NAME,
    html: {  
        src: SRC_DIR + '**/*.html', 
        manifest: REV_DIR + '**/*.json',
        bdmanifest: BDREV_DIR + '**/*.json',
        dist: DIST_DIR,
        builder: BUILD_DIR
    },  
    assets: {  
        src: SRC_DIR + 'assets/**/*',            // assets目录：./src/assets  
        dist: DIST_DIR + 'assets'                // assets文件build后存放的目录：./dist/assets  
        ,builder: BUILD_DIR + 'assets'    
    },  
    css: {  
        src: SRC_DIR + 'css/**/*.css',           // CSS目录：./src/css/  
        dist: DIST_DIR + 'css'                   // CSS文件build后存放的目录：./dist/css  
        ,builder: BUILD_DIR + 'css'
    },  
    sass: {  
        src: SRC_DIR + 'sass/**/*.scss',         // SASS目录：./src/sass/  
        dist: DIST_DIR + 'css'                   // SASS文件生成CSS后存放的目录：./dist/css  
        ,builder: BUILD_DIR + 'css' 
    },  
    js: {  
        src: SRC_DIR + 'js/**/*.js',             // JS目录：./src/js/  
        dist: DIST_DIR + 'js'                   // JS文件build后存放的目录：./dist/js  
        ,build_js: DIST_DIR + 'js/' + BUILD_NAME                  // 合并后的js的文件名  
        ,builder: BUILD_DIR + 'js' 
    },  
    img: {  
        src: SRC_DIR + 'images/**/*',            // images目录：./src/images/  
        dist: DIST_DIR + 'images'                // images文件build后存放的目录：./dist/images  
        ,builder: BUILD_DIR + 'images' 
    }  
};

module.exports = Config;