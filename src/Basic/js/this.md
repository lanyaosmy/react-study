## this

- 使用new调用，this指向new出来的对象
- 没有明确调用者，指向window
- 箭头函数不会绑定this
- DOM事件回调里，this指向绑定事件的对象(currentTarget)
- 严格模式下this是undefined(全局作用域还是指向window)

```js
function func() {
  "use strict"
  console.log(this);
}

func();   // 输出是undefined
```

### 自己实现call,apply,bind

```js
Function.prototype._call = function (...args) {
  if (typeof this !== 'function') {
    throw Error('not function');
  }
  const newThis = args[0] || window;
  const newArgs = args.slice(1);
  const fnSym = Symbol('fn');
  newThis[fnSym] = this;
  const result = newThis[fnSym](...newArgs);
  delete newThis[fnSym];
  return result;
};

Function.prototype._apply = function (...args) {
  if (typeof this !== 'function') {
    throw Error('not function');
  }
  const newThis = args[0] || window;
  const newArgs = args[1];
  const fnSym = Symbol('fn');
  newThis[fnSym] = this;
  const result = newThis[fnSym](...newArgs);
  delete newThis[fnSym];
  return result;
};

Function.prototype._bind = function (...args) {
  if (typeof this !== 'function') {
    throw Error('not function');
  }
  const _this = this;
  const newThis = args[0] || window;
  const newArgs = args.slice(1);
  return function Fn(...args1) {
    return _this.apply(
      this instanceof Fn ? this : newThis, // 作为构造函数new时，指向实例对象
      newArgs.concat(args1),
    );
  };
};
```
