#### new一个对象发生了神马
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new

1. 创建一个空的简单 JavaScript 对象。为方便起见，我们称之为 newInstance。
2. 如果构造函数的 prototype 属性是一个对象，则将 newInstance 的 [[Prototype]] 指向构造函数的 prototype 属性，否则 newInstance 将保持为一个普通对象，其 [[Prototype]] 为 Object.prototype。
> 备注： 因此，通过构造函数创建的所有实例都可以访问添加到构造函数 prototype 属性中的属性/对象。

3. 使用给定参数执行构造函数，并将 newInstance 绑定为 this 的上下文（换句话说，在构造函数中的所有 this 引用都指向 newInstance）。
4. 如果构造函数返回非原始值，则该返回值成为整个 new 表达式的结果。否则，如果构造函数未返回任何值或返回了一个原始值，则返回 newInstance。（通常构造函数不返回值，但可以选择返回值，以覆盖正常的对象创建过程。）

#### 手写new

```js
function myNew(Fn) {
    if (typeof Fn !== 'function') throw new TypeError('This is not a constructor') // Fn校验
    var args = Array.from(arguments).slice(1) // 取入参
    var obj = {} // 1.创建一个空的简单JavaScript对象（即`  {}  `）
    obj.__proto__ = Fn.prototype // 2.  为步骤1新创建的对象添加属性`  __proto__  `，将该属性链接至构造函数的原型对象
    // obj = Object.create(Fn.prototype) //以一个现有对象作为原型，创建一个新对象。
    var res = Fn.call(obj, ...args) // 3.  将步骤1新创建的对象作为this的上下文并传入参数；
    return Object(res) === res ? res : obj // 4.  如果该函数没有返回对象，则返回this。
}

```

#### 手写Object.create
```js
function create(obj) {
  function Func(){
    
  }
  Func.prototype = obj;
  Func.prototype.constructor = Func;
  return new Func();
}
```

### 实现instanceof方法
```js
function myInstanceof(obj, ctor) {
  let proto = Object.getPrototypeOf(obj);
  let prototype = ctor.prototype;
  while(true) {
    if(!proto) return false;
    if(proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
 
```
### 原型链继承

```js
function Father(name, age) {
  this.name = name
  this.age = age
  this.hobby = ['敲代码', '解Bug', '睡觉']
}
 
Father.prototype.sayName = function () {
  console.log(this.name, 666)
}
Father.prototype.x = 1
 
function Child(name, age) {
  Father.call(this, name, age) 
  this.a = 1
}
Child.prototype = Object.create(Father.prototype)
 
 
function Super(foo) {
  this.foo = foo
}
Super.prototype.printFoo = function() {
  console.log(this.foo)
}
function Sub(bar) {
  this.bar = bar
  Super.call(this)
}
Sub.prototype = Object.create(Super.prototype)
Sub.prototype.constructor = Sub
 
```