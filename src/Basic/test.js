/* eslint-disable no-extend-native */

function fn1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('1:' + new Date().toLocaleString());
      resolve('1');
    }, 2000);
  });
}

function fn2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2:' + new Date().toLocaleString());
      resolve('2');
    }, 2000);
  });
}

/**
 * 继发
 */

async function main() {
  await fn1();
  await fn2();
}

// main(); // 1 =2s后= 2

async function main1() {
  let arr = [fn1, fn2];
  for (let fn of arr) {
    await fn();
  }
  console.log('我后执行');
}
// main1(); // 1 =2s后= 2 我后执行

/**
 * 并发
 */

async function main2() {
  let [res1, res2] = await Promise.all([fn1(), fn2()]);
}
// main2(); // 1 =同时= 2

async function main3() {
  let arr = [fn1(), fn2()];
  for (let fn of arr) {
    await fn;
  }
}
// main3(); // 1 =同时= 2

async function main4() {
  let fnP1 = fn1();
  let fnP2 = fn2();
  await fnP1;
  await fnP2;
}
// main4(); // 1 =同时= 2

async function main5() {
  let arr = [fn1, fn2];
  arr.forEach(async (fn) => {
    await fn();
  });
  console.log('我先执行');
}

// main5(); // 我先执行 =2s= 1 =同时= 2

/**
 * finally和return
 */
function fn() {
  let a = 2;
  try {
    console.log(a);
    return 1;
    // console.log(a);
  } finally {
    a = 3;
    console.log(a);
  }
}

// console.log(fn()); // 2 3 1

function compose(...arrs) {
  return (args) => {
    return arrs.reduceRight((pre, curr) => {
      return curr.call(null, pre);
    }, args);
  };
}

const compose2 =
  (...args) =>
    (x) =>
      args.reduceRight((pre, curr) => curr(pre), x);
const add = (x) => x + 10;
const multiply = (x) => x * 10;
// let res = compose2(multiply, add)(10);
// console.log('res', res);

const arr = [1, 2, [3, 4], [5, 6, [7, 8]]];

/**
 * 数组扁平化
 * @param {*} arrs
 * @returns
 */

function flat(arrs) {
  let result = [];
  for (let i = 0, len = arrs.length; i < len; i++) {
    const v = arrs[i];
    if (Array.isArray(v)) {
      result = result.concat(flat(v));
    } else {
      result.push(v);
    }
  }
  return result;
}

const flat2 = (a, depth, init) => {
  let result = init || [];
  return a.reduce((prev, curr) => {
    if (Array.isArray(curr) && depth > 1) {
      return flat2(curr, depth - 1, prev);
    } else {
      return prev.concat(curr);
    }
  }, result);
};

// console.log(flat2(arr, 1));

/**
 * 缓存函数memo
 */

const fibonacci = (x) => {
  if (x === 1 || x === 2) {
    return 1;
  }
  return fibonacci(x - 1) + fibonacci(x - 2);
};

const memo = (fn, hash) => {
  const memoFun = (...args) => {
    const cache = memoFun.cache;
    const hashKey = hash ? hash.call(this, ...args) : args[0];
    if (!cache[hashKey]) {
      cache[hashKey] = fn.apply(this, args);
    }
    return cache[hashKey];
  };
  memoFun.cache = {};
  return memoFun;
};

const cachedfFibonacci = memo(fibonacci);

// // 然后看下效果
// let startTime = new Date().getTime();
// cachedfFibonacci(40);
// let needTime = new Date().getTime() - startTime;

// console.log(needTime); // 第一次运行时间还是959毫秒

// // 再调一次
// startTime = new Date().getTime();
// cachedfFibonacci(40);
// needTime = new Date().getTime() - startTime;

// console.log(needTime); // 时间直接变为0了，直接取缓存，快到1毫秒都不要

// lodash memoize
function memoize(fn, resolver) {
  if (
    typeof fn !== 'function' ||
    (resolver != null && typeof resolver !== 'function')
  ) {
    throw new TypeError('Expected a function');
  }
  const memoized = function (...args) {
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || Map)();
  return memoized;
}
memoize.Cache = Map;

export default memoize;
/**
 * curry函数
 */

function curry(fn) {
  let length = fn.length;
  return function executeFn(...args) {
    if (args.length >= length) {
      return fn(...args);
    } else {
      return (...args2) => executeFn(...args.concat(args2));
    }
  };
}
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}


const fun = (a, b, c) => {
  return [a, b, c];
};
const curriedFun = curry(fun);

console.log(curriedFun(1, 2, 3));

/**
 * 浅拷贝
 */

function shallowCopy(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * 深拷贝
 */

function deepCopy(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] && typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

let target2 = {
  name: 'John',
  age: 20,
  drive: () => { },
  girlFriend: undefined,
};
// console.log(deepCopy(target2));

/**
 * 拷贝Symbol
 */

function symbolCopy(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (let key of Reflect.ownKeys(obj)) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] && typeof obj[key] === 'object') {
        result[key] = symbolCopy(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
let target3 = {
  [Symbol('name')]: 'John',
  age: 20,
  drive: () => { },
  girlFriend: undefined,
};
// console.log(symbolCopy(target3));

/**
 * 循环引用
 */
function deepCopy2(targetObj) {
  const map = new WeakMap();
  function copy(obj) {
    if (map.has(obj)) {
      return map.get(obj);
    }
    const result = Array.isArray(obj) ? [] : {};
    map.set(obj, result);
    for (let key of Reflect.ownKeys(obj)) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          result[key] = copy(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }
  return copy(targetObj);
}
let target4 = {
  [Symbol('name')]: 'John',
  age: 20,
  drive: () => { },
  girlFriend: undefined,
};

target4.target = target4;

// console.log(deepCopy2(target4));

let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 交集
let union = new Set([...a, ...b]);
// 交集
let intersect = new Set([...a].filter((v) => b.has(v)));
// a 相对于 b的差集
let difference = new Set([...a].filter((v) => !b.has(v)));

function Puppy(age) {
  this.puppyAge = age;
}

Puppy.prototype.constructor = function myConstructor(age) {
  this.puppyAge = age + 1;
};

const myPuppy2 = new Puppy(2);
// console.log(myPuppy2.puppyAge); // 输出是2

function Child() {
  console.log('child');
  this.a = 1;
}
Child.prototype = new Puppy(1);

const child = new Child();

/**
 * this
 */

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
  return function (...args1) {
    return _this.apply(
      this instanceof _this ? this : newThis, // 作为构造函数new时，指向实例对象
      newArgs.concat(args1),
    );
  };
};

function promiseTest(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, time * 1000);
  });
}
new Promise((resolve, reject) => {
  resolve(1);
})
  .then(1)
  .then(console.log);
Promise._all = function (arg) {
  let arrs = arg.map((v) => {
    if (!(v instanceof Promise)) {
      return Promise.resolve(v);
    }
    return v;
  });
  return new Promise((resolve, reject) => {
    let result = [],
      i = 0,
      len = arrs.length;
    if (len === 0) {
      resolve(result);
    }
    for (; i < len; i++) {
      arrs[i]
        .then((res) => {
          result.push(res);
          if (result.length === len) {
            resolve(result);
          }
        })
        .catch((err) => reject(err));
    }
  });
};

const start = Date.now();
Promise._all([promiseTest(1), promiseTest(2)]).then((res) => {
  console.log(Date.now() - start, res);
});
// function MyPromise(resolve = Promise.resolve(), reject = Promise.reject()) {
//   Promise.call(this, resolve, reject);
// }
// MyPromise.prototype = new Promise((resolve) => resolve);
// MyPromise.prototype.constructor = MyPromise;
// new MyPromise((resolve) => resolve(1)).then((res) => {
//   console.log(res);
// });






function combineReducers(reducers) {
  const stateKeys = Object.keys(reducers);

  return function combine(state, action) {
    const finalState = {};
    for (let i = 0; i < stateKeys.length; i++) {
      const newKey = stateKeys[i];
      const newReducer = reducers[newKey];
      // 从root state中取出指定key的值作为reducer的state
      const prevState = state[newKey];
      finalState[newKey] = newReducer(prevState, action);
    }
    return finalState;
  };
}

/**
 * dispatch
 * subscribe
 * getState
 * @param {*} reducer
 */
function createStore(reducer, enhancer) {
  if (enhancer && typeof enhancer === 'function') {
    return enhancer(createStore)(reducer);
  }
  let state = {};
  const listeners = [];

  function subscribe(fn) {
    if (typeof fn !== 'function') {
      throw Error('not a function!');
    }
    listeners.push(fn);
    return function unsubscribe() {
      const index = listeners.indexOf(fn);
      listeners.splice(index, 1);
    };
  }
  function getState() {
    return state;
  }
  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((v) => {
      v(state);
    });
  }

  return {
    subscribe,
    getState,
    dispatch,
  };
}

function logger(store) {
  const { getState } = store;
  return (next) => (action) => {
    const returnValue = next(action);
    console.log('state after dispatch', getState());
    return returnValue;
  };
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    // const { dispatch } = store;

    const nextDispatch = middlewares.reduceRight((pre, middleware) => {
      const func = middleware(store);
      const nextDispatch = func(pre);
      return { ...store, dispatch: nextDispatch };
    }, store.dispatch);
    return { ...store, dispatch: nextDispatch };
  };
}
