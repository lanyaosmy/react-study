[toc]

### Modules

[模块方法](https://webpack.docschina.org/api/module-methods/#requireensure)

#### 静态导入导出

import、export

#### 动态导入 ```import()```

动态的加载模块。调用 import 的地方，被视为分割点，意思是，被请求的模块和它引用的所有子模块，会分割到一个单独的 chunk 中。

```javascript
// function(string path):Promise
const language = detectVisitorLanguage();
import(`./locale/${language}.json`).then((module) => {
  // do something with the translations
});
```

**内联注释（Magic Comments）**

在 import 中添加注释，我们可以进行诸如给 chunk 命名或选择不同模式的操作。

```javascript
// 单个目标
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackExports: ["default", "named"] */
  'module'
);

// 多个可能的目标
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  `./locale/${language}`
);

// 不进行代码分割
import(/* webpackIgnore: true */ 'ignored-module.js');
```

**webpackMode：**

- lazy
- lazy-once
- eager
- weak

**webpackPrefetch && webpackPreload**
[预获取/预加载模块](https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules)

- prefetch（预获取）：将来某些导航下可能需要的资源
- preload（预加载）：当前导航下可能需要资源

区别

- 预加载 chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- 预加载 chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- 预加载 chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。

#### 懒加载

```javascript
   button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
     const print = module.default;
     print();
   });
```

在点击按钮之后才加载print

- react懒加载
  - ```lazy```：第一次渲染时才加载组件代码


### loader和plugin
原文链接：https://blog.csdn.net/leelxp/article/details/108099138

#### loader
loader是文件加载器，能够加载资源文件，并对这些文件进行统一处理，诸如编译、压缩等，最终一起打包到指定的文件中。处理一个文件可以使用多个loader，loader的执行顺序和配置中的顺序正好相反，也就是说最后一个loader最先执行，第一个loader最后执行。第一个执行的loader的返回值接收源文件内容作为参数，其他loader接收前一个执行的loader的返回值作为参数，最后执行的loader会返回此模块的JavaScript的源码。

#### plugin
plugin的功能更加强大，loader不能做的，plugin都能做。plugin的功能要更加丰富，从打包 优化和压缩，到从新定义环境变量。功能强大到可以用来处理各种各样的任务。

常用的plugin有哪些？
ignore-plugin:忽略文件

uglifyjs-webpack-plugin:不支持es6压缩

terser-webpack-plugin:支持es6压缩

webpack-parallel-uglify-plugin:多进程执行代码压缩，提升构建速度

serviceworker-webpack-plugin:为网页应用增加离线缓存功能

commonsChunkPlugin:提高打包效率，将第三方库和业务代码分开打包

html-webpack-plugin:可以根据模版自动生成html代码，并自动引用css和js文件

HotModuleRelpacementPlugin:热更新


