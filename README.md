# gulp配置

### 包括开发环境及生产环境配置需要

**介绍**
1. 配置了css、sass编译 -> 生产环境下配置了合并压缩 -> 生成build.min.css
2. 配置了jslint/es2015进行js检查与编译es6 -> 生成统一的js： build.js -> 生产环境将其进行了压缩生成 -> build.min.js
3. 配置了图片压缩及base64图片转码
4. 配置了版本号，防止缓存：*仅限生产环境配置

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
### 注意：要执行生产环境，必须先执行npm start 创建dist目录。因为build依赖dist目录
**生产环境 - builder**
``` javascript
    npm run build
```
