/**
 * 单例模式
 */

// 普通写法
let Singleton = function (name) {
  this.name = name
  this.instance = null
}

Singleton.prototype.getName = function () {
  return this.name
}

Singleton.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name)
  }
  return this.instance
}

let a = Singleton.getInstance('a')
let b = Singleton.getInstance('b')
console.log(a === b)

// 闭包写法
Singleton.getInstance = (function () {
  let instance = null
  return function (name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()

// 透明的单例模式——使单例像普通的类一样使用

let Singleton = (function () {
  let instance
  let Singleton = function (name) {
    if (instance) {
      return instance
    }
    this.name = name
    return (instance = this)
  }
  return Singleton
})()

let a = new Singleton('a')
let b = new Singleton('b')
console.log(a === b)

// 用代理实现单例模式——单一职责原则
let Singleton = function (name) {
  this.name = name
}

let ProxySingleton = (function () {
  let instance
  return function (name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()
let a = new ProxySingleton('a')
let b = new ProxySingleton('b')
console.log(a === b)

// 惰性单例——在有需要的时候才创建对象实例

let getSingle = function (fn) {
  let instance
  return function () {
    return instance || (instance = fn.apply(this, arguments))
  }
}

/**
 * 策略模式
 * 定义一系列算法，把它们一个个封装起来，并且可以使它们相互替换
 * 将算法的使用和算法的实现分离开来
 * 至少由两部分组成，
 * 1. 一组策略类，封装具体的算法，
 * 2. Context环境类，接受客户的请求，随后把请求委托给某个策略类
 */

// 原始版本
let calculateBonus = function (level, salary) {
  if (level === 'S') {
    return salary * 4
  }
  if (level === 'A') {
    return salary * 3
  }
  if (level === 'B') {
    return salary * 2
  }
}

// 使用策略模式
let strategies = {
  S: (salary) => salary * 4,
  A: (salary) => salary * 3,
  B: (salary) => salary * 2,
}

let calculateBonus = function (level, salary) {
  return strategies[level](salary)
}

// 表单验证

let strategies = {
  isNonEmpty: function (value, errorfns) {
    // 不为空
    if (value === '') {
      return errorfns
    }
  },
  minLength: function (value, errorfns, length) {
    // 限制最小长度
    if (value.length < length) {
      return errorfns
    }
  },
  isMobile: function (value, errorfns) {
    // 手机号码格式
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorfns
    }
  },
}
// Context
class Validator {
  cache = []

  add(value, rules) {
    for (let rule of rules) {
      let ary = rule.strategy.split(':')
      this.cache.push(() => {
        let strategy = ary.shift()
        ary.unshift(rule.errorfns)
        ary.unshift(value)
        return strategies[strategy].apply(this, ary)
      })
    }
  }
  start() {
    for (let i = 0; i < this.cache.length; i++) {
      let validatorFunc = this.cache[i]
      let fns = validatorFunc()
      if (fns) {
        return fns
      }
    }
  }
}

let form = {
  userName: '123',
  password: 'sdf234',
  phoneNumber: '13534534534',
}
let validataFunc = function () {
  var validator = new Validator() // 创建一个 validator 对象
  /***************添加一些校验规则****************/
  validator.add(form.password, [
    {
      strategy: 'minLength:6',
      errorfns: '密码长度不能少于 6 位',
    },
  ])
  validator.add(form.phoneNumber, [{ strategy: 'isMobile', errorfns: '手机号码格式不正确' }])

  validator.add(form.userName, [
    {
      strategy: 'isNonEmpty',
      errorfns: '用户名不能为空',
    },
    {
      strategy: 'minLength:6',
      errorfns: '用户名长度不能少于 6 位',
    },
  ])
  var errorfns = validator.start() // 获得校验结果
  return errorfns // 返回校验结果
}
console.log(validataFunc())

/**
 * 策略模式的优缺点
 * 1. 利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句
 * 2. 开放-封闭原则
 * 3. 可复用
 * 4. 利用组合和委托来让Context拥有算法执行能力，是继承的一种轻便的踢打方案
 */

/**
 * 代理模式
 */
// 虚拟代理实现图片预加载
let myImage = (function () {
  let imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function (src) {
      imgNode.src = src
    },
  }
})()

// 虚拟代理合并HTTP请求
let synchronousFile = function (id) {
  console.log('开始同步文件， id 为: ' + id)
}

class SyncProxy {
  cache = []
  timer
  proxy(id) {
    this.cache.push(id)
    if (this.timer) {
      return
    }
    this.timer = setTimeout(() => {
      synchronousFile(this.cache.join(','))
      clearTimeout(this.timer)
      this.timer = null
      this.cache = []
    }, 2000)
  }
}

// 惰性加载
// 缓存代理，为一些开销大的运算结果提供暂时的存储

// 用高阶函数动态创建代理
let mult = function () {
  let a = 1
  for (let i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i]
  }
  return a
}

let plus = function () {
  let a = 0
  for (let i = 0, l = arguments.length; i < l; i++) {
    a = a + arguments[i]
  }
  return a
}

let createProxyFactory = function (fn) {
  let cache = {}
  return function () {
    let args = Array.prototype.join.apply(arguments)
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = fn.apply(this, arguments))
  }
}

let multProxy = createProxyFactory(mult)
let plusProxy = createProxyFactory(plus)

console.log(multProxy(1, 2, 3, 4))
console.log(multProxy(1, 2, 3, 4))
console.log(plusProxy(1, 2, 3, 4))
console.log(plusProxy(1, 2, 3, 4))

/**
 * 迭代器模式
 * 指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
 */

// 内部迭代器——forEach
// 函数内部已经定义好了迭代规则，完全接受整个迭代过程，外部只需要一次初始调用

// 外部迭代器——类似Generator，必须显式地请求迭代下一个元素

let Iterator = function (obj) {
  let current = 0
  let isDone = function () {
    return current >= obj.length
  }

  let next = function () {
    current += 1
  }

  let getCurItem = function () {
    return obj[current]
  }

  return {
    isDone,
    next,
    getCurItem,
  }
}

let compare = function (iterator1, iterator2) {
  while (!iterator1.isDone() && iterator2.isDone()) {
    if (iterator1.getCurItem() !== iterator2.getCurItem()) {
      throw new Error('!==')
    }
    iterator1.next()
    iterator2.next()
  }
  console.log('=.=')
}
let iterator1 = Iterator([1, 2, 3])
let iterator2 = Iterator([1, 2, 3])

compare(iterator1, iterator2)

// 使用迭代器优化查找上传组件
var iteratorUploadObj = function () {
  for (var i = 0, fn; (fn = arguments[i++]); ) {
    var uploadObj = fn()
    if (uploadObj !== false) {
      return uploadObj
    }
  }
}
var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUpladObj)

/**
 * 发布-订阅模式
 * 例子：DOM事件
 */

// 自定义事件

/**
 * 命令模式
 * 命令模式中的命令（command）指的是一个执行某些特定事情的指令
 * 命令模式最常见的应用场景是：有时候需要向某些对象发送请求，
 *  但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。
 *  此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接
 *  收者能够消除彼此之间的耦合关系。
 */

let setCommand = function (button, command) {
  button.click = function () {
    command.execute()
  }
}

let MenuBar = {
  refresh: function () {
    console.log('刷新菜单界面')
  },
}

let RefreshMenuBarCommand = function (receiver) {
  return {
    execute: function () {
      receiver.refresh()
    },
  }
}

let refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar)
setCommand(button1, refreshMenuBarCommand)
