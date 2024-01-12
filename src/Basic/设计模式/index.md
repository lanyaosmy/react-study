
- [设计模式](https://hejialianghe.github.io/jsadvanced/designpattern.html)

## 设计原则

- 开闭原则：对扩展开发，对修改关闭
- 单一职责原则
- 依赖倒置原则：上层不依赖于下层，依赖于抽象
- 接口隔离原则：一个接口不要调用太多方法
- 迪米特原则：两个对象之间通信，互相之前知道的越少越好
- 里氏替换原则：子类继承父类时，必须保证完全继承父类属性和方法

## 模式示例

### 创建型

#### 工厂模式

```javascript
function Factory(type){
  switch (type) {
    case 1:
      return new Type1()
      break;
    case 2:
      return new Type2()
      break;
    default:
      break;
  }
}
```

#### 建造者模式

复杂的类拆分成独立的类，组装在一起

```javascript
function Model1(){}

function Model2(){}

function Construct(){
  this.mode1 = new Model1()
  this.mode2 = new Model2()
}
```

#### 单例模式

全局只有一个实例

```javascript
function store() {
  this.state = {}
  if (store.install) {
    return store.install
  }
  store.install = this
}

store.install = null
var s1 = new store()
var s2 = new store()
s1.state.a = 1
console.log(s1, s2) // store { state: { a: 1 } } store { state: { a: 1 } }
```

### 复用型

#### 桥接模式

把重复的方法抽取出来

#### 享元模式

保留所有共有的，不同的部分留作为一个公共享元

#### 模版方法模式

写一个基础的类，然后具体的实现，延迟到具体的使用时

### 提高可扩展性

#### 适配器模式

- 框架变更
- 参数适配

#### 装饰器模式

先调用一下原来的方法，然后加上更多的操作

扩展你的已有事件绑定

vue 事件绑定

```javascript
var arrayProto = Array.prototype
var arrayMethods = Object.create(arrayProto)
var methodsToPatch = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'resverse',
  'sort'
]

methodsToPatch.forEach(method => {
  var original = arrayMethods[method]
  object.defineProperty(arrayMethods, method, {
    value(...args) {
      const result = original.apply(this, args)
      dep.notify()
      return result
    }
  })
})

```

#### 命令模式

- [框架源码中用来提高扩展性的设计模式](https://juejin.cn/post/6844904174451179528)

### 职责链模式

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

function Axios() {
  this.interceptors = {
    request: new InterceptionManager(),
    response: new InterceptionManager(),
  };
}

function InterceptionManager() {
  this.handlers = [];
}

InterceptionManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({ fulfilled, rejected });
};
function dispatchRequest() {
  // 发送请求
}
Axios.prototype.request = function (config) {
  const chain = [dispatchRequest, null];

  this.interceptors.request.handlers.forEach(({ fulfilled, rejected }) => {
    chain.unshift(fulfilled, rejected);
  });

  this.interceptors.response.handlers.forEach(({ fulfilled, rejected }) => {
    chain.push(fulfilled, rejected);
  });
  let promise = Promise.resolve(config);
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
};

```

### 观察者模式

node的EventEmitter
