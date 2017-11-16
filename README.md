# gulp配置
###### 新增postcss配置:http://www.w3cplus.com/PostCSS/postcss-deep-dive-shortcuts-and-shorthand.html 相关插件
### 包括开发环境及生产环境配置需要

**介绍**
1. 配置了css、sass编译 -> 生产环境下配置了合并压缩 -> 生成build.min.css
2. 配置了jslint/es2015进行js检查与编译es6 -> 生成统一的js： build.js -> 生产环境将其进行了压缩生成 -> build.min.js
3. 配置了图片压缩及base64图片转码
4. 配置了版本号，防止缓存：*仅限生产环境配置
## *使用说明
 由于添加了版本号信息，所以需要先手动更改依赖版本号文件：gulp-rev和gulp-rev-collector(重要)
 ``` javascript
 1.打开node_modules\gulp-rev\index.js
    第134行 manifest[originalFile] = revisionedFile;
    更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;
  2.打开nodemodules\gulp-rev\nodemodules\rev-path\index.js
    10行 return filename + '-' + hash + ext;
    更新为: return filename + ext;
    或者
    9行 return modifyFilename(pth, (filename, ext) => `${filename}-${hash}${ext}`);
    更新为: return modifyFilename(pth, (filename, ext) => `${filename}${ext}`);
  3.打开node_modules\gulp-rev-collector\index.js
    40行 var cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
    更新为: let cleanReplacement =  path.basename(json[key]).split('?')[0];
```
作者：win_wlq
链接：http://www.jianshu.com/p/df593ad8082d
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
## 使用
**需要node环境-npm包**
  执行：安装所需依赖
``` javascript
    npm install
```

**初始化 - 开发环境 - dist**
``` javascript
    npm start
```

**生产环境 - builder**
``` javascript
    npm run build
```
