function vue() {
  this.$data = { a: 1 };
  this.el = document.getElementById('app');
  this.observer(this.$data);
  this.render();
}

vue.prototype.observer = function (obj) {
  let value;
  // let self = this;
  for (let key in obj) {
    value = obj[key];
    if (typeof value === 'object') {
      this.observer(value);
    } else {
      Object.defineProperty(this.$data, key, {
        get: function () {
          // dep.depend(); // 这里进行依赖收集
          return obj[key];
        },
        set(newValue) {
          value = newValue;
          // self.render();
          // dep.notify(); // 这里进行virtualDom更新，通知需要更新的组件render
        },
      });
    }
  }
};
vue.prototype.render = function () {
  this.virtualDom = `I am ${this.$data.a}`;
  this.el.innerHTML = this.virtualDom;
};
// Vue里面操作数组，直接用下标更改，是没有用的，必须使用push, shift等方法来操作，为什么呢？
// Vue用装饰者模式来重写了数组这些方法

// 原型链

function Shape() {
  this.x = 0;
  this.y = 0;
}

Shape.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
  console.log('Shape moved');
};

function Rectangle() {
  Shape.call(this);
}

Rectangle.prototype = Object.create(Shape.prototype);

Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();
console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle); // true
console.log('Is rect an instance of Shape?', rect instanceof Shape); // true
rect.move(1, 1); // Outputs, 'Shape moved.'

// 复制数组原型
let arrayProto = Array.prototype;
let arrayob = Object.create(arrayProto);
let funcs = ['push', 'pop', 'shift'];

// funcs.forEach((fn) => {
//   arrayob[fn] = function () {
//     arrayProto.call(this, arguments);
//     // dep.notify()
//   };
// });
// 对于用户定义的数组，手动将数组的__proto__指向我们修改过的原型
let a = [1, 2, 3];
a.__proto__ = arrayob;

// 使自定义方法禁止修改
function def(obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: false,
    writable: false,
    value,
  });
}

funcs.forEach((fn) => {
  def(arrayob, fn, function () {
    arrayProto.call(this, arguments);
    // dep.notify()
  });
});

/**
 * Vue3.0的响应式——使用es6的Proxy和Reflect
 * 好处如下：
 * 1. Object.defineProperty需要指定对象和属性，对于多层嵌套的对象需要递归监听，
 *    Proxy可以直接监听整个对象，不需要递归；
 * 2. Object.defineProperty的get方法没有传入参数，如果我们需要返回原值，
 *    需要在外部缓存一遍之前的值，Proxy的get方法会传入对象和属性，可以直接在函数内部操作，
 *    不需要外部变量；
 * 3. set方法也有类似的问题，Object.defineProperty的set方法传入参数只有newValue，
 *    也需要手动将newValue赋给外部变量，Proxy的set也会传入对象和属性，
 *    可以直接在函数内部操作；
 * 4. new Proxy()会返回一个新对象，不会污染源原对象
 * 5. Proxy可以监听数组，不用单独处理数组
 */

vue.prototype.observer = function (obj) {
  let self = this;
  this.$data = new Proxy(this.$data, {
    get: function (target, key) {
      return target[key];
    },
    set: function (target, key, value) {
      target[key] = value;
      self.render();
    },
  });
};
