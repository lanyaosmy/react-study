# Symbol

## 概念

一种新的原始数据类型Symbol，表示独一无二的值。
它属于 JavaScript 语言的原生数据类型之一
其他数据类型是：

- undefined
- null
- 布尔值（Boolean）
- 字符串（String）
- 数值（Number）
- 大整数（BigInt）
- 对象（Object）

## 特性

- 如果 Symbol 的参数是一个对象，就会调用该对象的toString()方法，将其转为字符串，然后才生成一个 Symbol 值。
- 相同参数的Symbol函数的返回值是不相等的。
- Symbol 值不能与其他类型的值进行运算，会报错。
- Symbol 值可以显式转为字符串。Symbol 值也可以转为布尔值，但是不能转为数值。

### Symbol.prototype.description——Symbol的描述

### Symbol作为属性名保证不会出现同名属性

Symbol 值作为对象属性名时，不能用点运算符。

点运算符后面总是字符串

### Symbol.for()——重新使用同一个 Symbol 值

接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。
如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。

```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```

> Symbol.for()为 Symbol 值登记的名字，是全局环境的，不管有没有在全局环境运行。
> Symbol.for()的这个全局登记特性，可以用在不同的 iframe 或 service worker 中取到同一个值。

### Symbol.keyFor()方法返回一个已登记的 Symbol 类型值的key
