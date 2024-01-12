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
