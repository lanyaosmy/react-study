// https://es6.ruanyifeng.com/#docs/proxy
var obj = new Proxy(
  {},
  {
    get: function (target, propKey, receiver) {
      console.log(`getting ${propKey}!`, target, receiver);
      return Reflect.get(target, propKey, receiver);
    },
    set: function (target, propKey, value, receiver) {
      console.log(`setting ${propKey}!`, target, value, receiver);
      return Reflect.set(target, propKey, value, receiver);
    },
  },
);
obj.count = 1;
++obj.count;
// setting count!
// getting count!
// setting count!

var handler = {
  get: function (target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function (target, thisBinding, args) {
    return args[0];
  },

  construct: function (target, args) {
    return { value: args[1] };
  },
};

var fproxy = new Proxy(function (x, y) {
  return x + y;
}, handler);

fproxy(1, 2); // 1
new fproxy(1, 2); // {value: 2}
console.log(fproxy.prototype === Object.prototype); // true
console.log(fproxy.foo === 'Hello, foo'); // true

/**
 * get方法
 * get方法用于拦截某个属性的读取操作，可以接受三个参数，
 * 依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），
 * 其中最后一个参数可选。
 */

var person = {
  name: '张三',
};

var proxy = new Proxy(person, {
  get: function (target, propKey) {
    if (propKey in target) {
      return target[propKey];
    } else {
      throw new ReferenceError('Prop name "' + propKey + '" does not exist.');
    }
  },
});

console.log(proxy.name); // "张三"
console.log(proxy.age); // 抛出一个错误
