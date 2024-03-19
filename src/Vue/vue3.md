### 为什么vue3 watch( )无法监听对象属性

https://juejin.cn/post/7013312008410005541

```js
const user = reactive({ name: 'tom' })
// ✅ 方法一，传递响应对象
watch(user, (value) => {
    console.log(value) // 监听成功，输出 { name: 'jake' }
})
// ❌ 方法二：传递响应对象下的属性
watch(user.name, (value) => {
    console.log(value) // 监听失败，没输出
})
// ✅ 方法三：传递函数，函数返回响应对象属性
watch(() => user.name, (value) => {
    console.log(value); // 监听成功，输出 jake
})
// 对响应对象重新赋值
user.name = 'jake'

```

Vue3是基于Proxy实现数据响应的，proxy的getter用来触发track函数，track函数把依赖的effect加入到deps；对数据重新赋值，触发proxy的setter并触发trigger函数把依赖的队列全部执行，其中要执行的任务就是effect，例如对一个响应数据重新赋值，页面自动更新，这就是一个effect任务。

回到刚才的watch问题，直接传入user.name，那effect将变成
```js
// watch写法
watch(user.name, cb)
// effect代码
effect(() => 'tom');
```

effect里面的是非proxy对象，就没法触发getter，也就没法收集该effect，最终导致watch失效.
那如果传入的watch是一个函数，effect里的user.name刚好触发了user这个Proxy的name属性，所以可以把effect加入依赖。
```js
//watch写法
watch(() => user.name, cb);
// effect代码
effect(() => user.name)
```

所以关于为什么Vue要忽略值类型是因为Vue需要依赖Proxy对象实现依赖收集

### 小型响应系统实现
```js
// targetMap用来记录不同对象
const targetMap = new WeakMap()
let activeEffect = null

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

// 收集依赖
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
      dep = new Set()
      depsMap.set(key, dep)
    }
    dep.add(activeEffect)
  }
}

// 触发依赖
function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach((effect) => effect())
  }
}

// 定义响应数据
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (result && oldValue != value) {
        trigger(target, key)
      }
      return result
    },
  }
  return new Proxy(target, handler)
}

function watch(source, cb) {
  effect(() => {
    const res = source();
    cb(res)
  })
}

let product = reactive({ price: 5, quantity: 2 })

watch(() => product.price, (value) => {
  console.log(value, 'product change')
})

setTimeout(() => {
  product.price = 10
}, 1000);

```