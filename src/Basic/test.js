function fn1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('1:' + new Date().toLocaleString())
      resolve('1')
    }, 2000)
  })
}

function fn2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2:' + new Date().toLocaleString())
      resolve('2')
    }, 2000)
  })
}

/**
 * 继发
 */

async function main() {
  await fn1()
  await fn2()
}

// main()

async function main1() {
  let arr = [fn1, fn2]
  for (let fn of arr) {
    await fn()
  }
  console.log('我后执行')
}
main1()

/**
 * 并发
 */

async function main2() {
  let [res1, res2] = await Promise.all([fn1(), fn2()])
}
// main2()

async function main3() {
  let arr = [fn1(), fn2()]
  for (let fn of arr) {
    await fn
  }
}
// main3()

async function main4() {
  let fnP1 = fn1()
  let fnP2 = fn2()
  await fnP1
  await fnP2
}
// main4()

async function main5() {
  let arr = [fn1, fn2]
  arr.forEach(async (fn) => {
    await fn()
  })
  console.log('我先执行')
}

main5()
