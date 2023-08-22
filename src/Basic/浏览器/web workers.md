
## Web Worker

### 介绍

- 一个 Web API-> 浏览器能力 -> 提供一个 js 可以运行的环境
- Web 应用程序可以在独立于主线层的后台线程中，运行一个脚本操作
- 关键点：性能考虑

#### worker线程和主线程通信

主线程和worker线程都有以下方法

- postMessage：发送通知
- onMessage：接受通知

### 使用场景

解决的痛点: js 执行复杂运算时阻塞了页面渲染

- 复杂运算
- 渲染优化（canvas 有个离线的 api 结合 worker）
- 流媒体数据处理

## Blob

```javascript
var blob = new Blob(data[, options]))
```

- data是一组数据，所以必须是数组，即使只有一个字符串也必须用数组装起来.
- options是对这一Blob对象的MIME属性

### URL.createObjectURL(blob)

URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。
这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL对象表示指定的 File 对象或 Blob 对象。

参数blob是用来创建URL的File对象或者Blob对象，返回值格式是：blob://URL。

#### URL.revokeObjectURL()

释放URL对象

> 目前，Blob对象大多是运用在，处理大文件分割上传（利用Blob中slice方法），处理图片canvas跨域(避免增加crossOrigin = "Anonymous",生成当前域名的url，然后 URL.revokeObjectURL()释放，createjs有用到)，以及隐藏视频源路径等等。

[JavaScript 中 Blob 对象](https://juejin.cn/post/6844903480704892942)
