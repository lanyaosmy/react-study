/**
 * Promise.all
 */


/**
 * @param {Array<any>} promises - notice input might have non-Promises
 * @return {Promise<any[]>}
 */
function all(promises) {
  // your code here

  return new Promise((resolve, reject) => {
    if (!promises.length) resolve([])
    let result = []
    let count = 0
    for (let i = 0; i < promises.length; i++) {
      let func = promises[i]
      Promise.resolve(func).then((res) => {
        // console.log(i,count)
        result[i] = res
        count += 1
        if (count === promises.length) {
          resolve(result)
        }
      }, (err) => { reject(err) })
    }
  })
}

// const arr = [];
// for (var i = 0; i < 10; i++) {
//   arr.push(fn);
// }
all([1, 2, 4]).then((res) => {
  console.log(res)
})


/**
 * Promise节流
 * @param {() => Promise<any>} func
 * @param {number} max
 * @return {Promise}
 */
function throttlePromises(funcs, max) {
  // your code here
  if (!funcs) return
  let count = 0
  let i = 0
  let len = funcs.length
  let result = new Array(funcs.length)

  return new Promise((resolve, reject) => {
    const exec = (ind) => {
      funcs[ind]().then((res) => {
        result[ind] = res
        count -= 1
        run()
        console.log(ind, result)
      }, (err) => { reject(err); })
    }
    const run = () => {
      // console.log(i,count,result)
      if (i === len && count === 0) {
        resolve(result)
        // break;
      }
      while (i < len && count < max) {
        count += 1
        exec(i)

        i += 1
      }
    }
    run()
  })
}

const fn = () => {
  return new Promise((resolve) => {
    const time = Math.random() * 100
    setTimeout(() => resolve(time), time)
  })
}
const arr = [];
for (var i = 0; i < 10; i++) {
  arr.push(fn);
}
throttlePromises(arr, 5).then((res) => {
  console.log(res)
})

/**
 * 手写Promise
 */

class MyPromise {
  constructor(callback) {
    this.status = "pending";
    this.value = "";
    this.reason = "";
    // 存储成功状态的回调函数
    this.onResolvedCallbacks = [];
    // 存储失败状态的回调函数
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status == "pending") {
        this.status = "resolved"
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn(value));
      }
    }
    const reject = (reason) => {
      if (this.status == "pending") {
        this.status = "rejected"
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn(reason));
      }
    }
    try {
      callback(resolve, reject);
    } catch (error) {
      reject(error);
    }

  }

  then(onResolved, onRejected) {
    onResolved = typeof onResolved === "function" ? onResolved : (value) => value;
    onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason };
    const promise2 = new MyPromise((resolve, reject) => {
      const resolveFn = () => {

        try {
          const x = onResolved(this.value)
          return x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error)
        }

      }

      const rejectFn = () => {
        try {
          const x = onRejected(this.reason)
          return x instanceof MyPromise ? x.then(resolve, reject) : reject(x);
        } catch (error) {
          reject(error)
        }
      }
      if (this.status == "resolved") {
        console.log('1111111111')
        resolveFn()
      }
      if (this.status == "rejected") {
        console.log('2222222')
        rejectFn()
      }
      if (this.status == "pending") {
        console.log('333333333333')
        this.onResolvedCallbacks.push(() => {
          if (this.status == "resolved") {
            resolveFn()
          }
        })
        this.onRejectedCallbacks.push(() => {
          if (this.status == "rejected") {
            rejectFn()
          }
        })
      } else {
        // 执行完所有回调函数之后，清空回调数组
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
      }
    })
    return promise2
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}

const promise = new MyPromise((resolve, reject) => {
  // setTimeout(() => {
  // 	console.log('1')
  resolve('成功')
  // }, 1000)
})
promise.then(1).
  then(value => {
    // console.log('2')
    // return "第一次"
    // setTimeout(() => {
    console.log('1')
    // return "第一次"
    // },1000)
  }).then(value => {
    console.log('3')
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve('第二次处理结果');
      }, 1000);
    });
  }).then(value => {
    console.log(value);
    throw new Error('抛出异常');
  }).catch(error => {
    console.log(error);
  });