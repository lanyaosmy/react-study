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
