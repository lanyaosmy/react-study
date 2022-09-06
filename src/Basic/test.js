const { set } = require('date-fns');
const {
  default: areIntervalsOverlapping,
} = require('date-fns/areIntervalsOverlapping');

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
const fun = (a, b, c) => {
  return [a, b, c];
};
const curriedFun = curry(fun);

// console.log(curriedFun(1, 2, 3));

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
  drive: () => {},
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
  drive: () => {},
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
  drive: () => {},
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
