[[译]官方图解：Chrome 快是有原因的，现代浏览器的多进程架构！（Part 1）](https://juejin.cn/post/6844903701526642702)

CPU
GPU 更擅长处理简单任务，同时可以跨多个核心

## 进程和线程

进程可以理解是应用程序的执行程序，线程则是存在于进程内部，并执行其进程程序的部分功能。
进程通过IPC进行通信

下面是浏览器进程

- 浏览器（Browser）：控制 “Chrome” 应用程序，包括地址栏、书签、后退和前进按钮等。还需要处理 Web 浏览器的权限管理，例如网络请求和文件访问。
- 渲染器（Renderer）：控制选项卡内，网站里显示的所有内容。
  - GUI线程：负责渲染页面，解析 html、css；构建 DOM 树和渲染树
  - JS引擎：与 gui 线程互斥
  - 定时器触发线程
  - 事件触发线程
  - 异步HTTP请求线程
- 插件（Plugin）：控制网站使用的插件，例如：Flash。
- GPU：独立于其他进程，专用于处理 GPU 任务，它被分成不同的进程，因为 GPU 会处理来自多个进程的请求，并将它们绘制在相同的 Surface 中。
- 网络？

分成多个进程的另一个好处是安全性和沙盒

### Chrome 服务化 — 更省内存

Chrome 正在进行体系结构更改，以便将浏览器程序的每个部分，作为一项服务运行，从而可以轻松拆分为不同的流程或汇总为同一个流程。

一般的想法是，当 Chrome 在强大的硬件上运行时，它可能会将每个服务拆分为不同的进程，从而提供更高的稳定性，但如果它位于资源约束的设备上，Chrome 会将服务整合到一个进程中，从而节省内存占用。

### 站点隔离 — 独立渲染进程

为每个跨网站 iframe 运行单独的渲染器进程

## Event Loop

在程序中设置 2 个线程，一个负责程序本身的运行，称为“主线程”；另一个负责主线程和其他进程（主要是各种 I/O 操作）的通信

### 宏任务（普通任务）和微任务

#### 宏任务

- script：script 整体代码
- setImmediate：node 的一个方法
- setTimeout 和 setInterval
- requestAnimationFrame
- I/O
- UI rendering

#### 微任务

- Object.observe:监听对象变化的一个方法（已废弃）
- MutationObserver:可以监听 Dom 结构变化的一个 api
- postMessage:window 对象通信的一个方法
- Promise.then catch finally

#### 执行顺序

宏任务 --> 清空微任务队列 --> 下一个宏任务

tips:

- 一个 Event Loop 有一个或多个 task queue（任务队列）
- 每个 Event Loop 有一个 microtask queue（微任务队列）
- requestAnimationFrame 不在任务队列也不在为任务队列，是在渲染阶段执行的

### nodejs的Event Loop

![poll阶段](https://img-pub.fbcontent.cn/ybcweapp/images/t93q7wikt.png)

- poll 队列是否空或受到限制
  - 否：执行 poll 队列的 callback
  - 是：检查setImmediate有没有设置 callback
    - 是：进入check阶段
    - 否：等待 callback 加入 poll 队列
      - 有callback：回到开头
      - 空闲：检查 timer（定时器）是否到时间 --> 到时间进入timer阶段

#### process.nextTick()

process.nextTick()是一个异步的 node API，但不属于 event loop 的阶段，
它的作用是当调用这个方法的时候，event loop 会先停下来，先执行这个方法的回调

process.nextTick 优先于其他微任务的执行

```javascript
console.log(1)
setTimeout(() => {
  console.log(2)
  process.nextTick(() => {
    console.log(3)
  })
  new Promise(resolve => {
    console.log(4)
    resolve()
  }).then(() => {
    console.log(5)
  })
})

new Promise(resolve => {
  console.log(7)
  resolve()
}).then(() => {
  console.log(8)
})

process.nextTick(() => {
  console.log(6)
})

// 1 7 6 8 2 4 3 5
```

## Promise

```javascript
const promise = Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

// 1
```

then 方法不是函数的参数会忽略掉

**Promise.allSettled([p1,...,pn])**
输入一组 promise 返回一个新的 promise，所有的 promise 状态改变后，结果 promise 变成 fulfilled

## Generator

- es6 异步编程解决方案
- 声明：通过 function *声明
- 返回值：符合可迭代协议和迭代器协议的生成器对象
- 在执行时能暂停，又能从暂停出继续执行
生成器对象原型上有 3 个方法：1.next(param); 2.return(param) 3.throw(param)

- 迭代器
有 next 方法，执行返回结果对象 结果对象包含：1.value 2.done

```javascript
function createGenerator(list) {
  let i = 0;
  return {
    next: () => {
      const done = i >= list.length;
      const value = !done ? list[i++] : undefined;
      return {
        value,
        done,
      };
    },
  };
}
```

### yield关键字

- 只能出现在 Generator 函数
- 用来暂停和恢复生成器函数
- next 执行
  - 遇 yield 暂停，将紧跟 yield 表达式的值作为返回的对象的 value
  - 没有 yield，一直执行到 return，将 return 的值作为返回的对象的 value
  - 没有 return，将 undefined 作为返回的对象的 value
- next 参数
  - next 方法可以作为一个参数，该参数会被当作一个 yield 表达式的返回值

```javascript
function* createIterator() {
  let first = yield 1
  let second = yield first + 2
  yield second + 3
}
let iterator = createIterator()
iterator.next() // {value:1,done:false}
iterator.next(4) // {value:6,done:false}
iterator.next(5) // {value:8,done:false}
iterator.next() // {value:undefined,done:true}
```

第二个 next 执行的时候，上一次 next 执行的时候 yield 1 返回了，但是 first 的值还未赋值；
因为我们执行 yield 的时候就停了，停了之后到第二个 next 执行的时候会才会从 first 这个值开始执行，
next 传入了参数 4 会把 第一次执行的 yield 值改变，所以这个时候 first 是 4，
那么 first+2 是 6，这时候还没执行完 done 是 false，value 是 6

#### yield* 生成器函数/可迭代对象

```javascript
function* generator1 (){
  yield 1
  yield 2
}
function* gennerator2 (){
  yield 100
  yield* generator1()
  yield 200
}
```

#### return(param)

给定 param 值终结遍历器，param 可缺省

#### throw(param)

让生成器对象内部抛出错误

```javascript
function* createIterator() {
  let first = yield 1
  let second
  try {
    second = yield first + 2
  } catch (e) {
    second = 6
  }
  yield second + 3
}
let iterator = createIterator()
iterator.next() // {value:1,done:false}
iterator.next(10) // {value:12,done:false}
iterator.throw(new Error('error')) // {value:9,done:false}  遇到yield才会暂停
iterator.next() //{value:undefined,done:true}
```

### async/await

= Generator + Promise 的语法糖

```javascript
function asyncFn(gen) {
  return function () {
    return new Promise((resolve, reject) => {
      const g = gen();
      function next(param) {
        const res = g.next(param);
        if (res.done) {
          resolve(res.value);
        } else {
          return res.value.then((val) => next(val));
        }
      }
      next();
    });
  };
}

```
