
#### Babel JSX转换

[官方转换地址](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=MYewdgzgLgBAwiArmKBTATjAvDAFAbzEQFsBfASiwD58AoASHVSkXTBgB4ATASwDcaRMhwD0vAbVK1aoSLACCAB0XZauWjE7iqGzZwAWARhg8uWAERQeUADapzVACrW7oozr2cAhjH1MAZhYAHiEOAFIkiqJeHnocCMhomEJY-ABMpCKxmhwQqMBW4NlxisWe8uhWwHa6nqKltSVU9cWieQU8Rbqi2rTkANy0QA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=true&targets=&version=7.20.12&externalPlugins=&assumptions=%7B%7D)

转换前

```js
const Counter = ({num})=>{
 return <div>{num}</div>
}

const App =
(
  <div>
    <h1 id="title">Title</h1>
    <a href="xxx">Jump</a>
    <Counter num={2}/>
    <section>
      <p>
        Article
      </p>
      <p></p>
    </section>
  </div>
);
```

转换后

```js
"use strict";

const Counter = ({ num }) => {
  return /*#__PURE__*/ React.createElement("div", null, num);
};
const App = /*#__PURE__*/ React.createElement(
  "div",
  null,
  /*#__PURE__*/ React.createElement(
    "h1",
    {
      id: "title"
    },
    "Title"
  ),
  /*#__PURE__*/ React.createElement(
    "a",
    {
      href: "xxx"
    },
    "Jump"
  ),
  /*#__PURE__*/ React.createElement(Counter, {
    num: 2
  }),
  /*#__PURE__*/ React.createElement(
    "section",
    null,
    /*#__PURE__*/ React.createElement("p", null, "Article"),
    /*#__PURE__*/ React.createElement("p", null)
  )
);

```

### createElement

数据结构

```json
{
  type: 'h1',
  props: {
    id: 'title',
    children: 'Title'
  }
}
```

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
```

### render

```js

// ReactDOM.render(<App />, document.getElementById('root'))
function render(vDom, container) {
  let dom;
  // 检查是不是文本节点
  if (typeof vDom !== 'object') {
    dom = document.createTextNode(vDom);
  } else {
    dom = document.createElement(vDom.type);
  }

  // 将除了children的属性挂载到dom上
  if (vDom.props) {
    Object.keys(vDom.props)
      .filter((v) => v !== 'children')
      .forEach((v) => {
        dom[v] = vDom.props[v];
      });
  }

  // 递归调用子元素
  if (vDom.props && vDom.props.children && vDom.props.children.length) {
    vDom.props.children.forEach((child) => render(child, dom));
  }

  container.appendChild(dom);
}
```

## Fiber

### 问题

Stack Reconciler，主要是为了区别 Fiber Reconciler 取的一个名字。这种方式有一个特点：一旦任务开始进行，就无法中断，那么 js 将一直占用主线程， 一直要等到整棵 Virtual DOM 树计算完成之后，才能把执行权交给渲染引擎，那么这就会导致一些用户交互、动画等任务无法立即得到处理，就会有卡顿，非常的影响用户体验。

问题：任务一旦执行，就无法中断，js 线程一直占用主线程，导致卡顿。

### Fiber是什么

Fiber 是一种数据结构(堆栈帧)，也可以说是一种解决可中断的调用任务的一种解决方案，它的特性就是时间分片(time slicing)和暂停(supense)。

### Fiber是如何工作的呢？

- ReactDOM.render() 和 setState 的时候开始创建更新。

- 将创建的更新加入任务队列，等待调度。

- 在 requestIdleCallback 空闲时执行任务。

- 从根节点开始遍历 Fiber Node，并且构建 WokeInProgress Tree。

- 生成 effectList。

- 根据 EffectList 更新 DOM。


reconciler——diff

diff过程和renderer负责操作DOM的appendChild等API是同步的，JS线程和GUI线程是互斥的，因此导致页面卡顿

Fiber可以将长时间的同步任务拆分成多个小任务，从而让浏览器能够抽身去响应其他事件，等他空了再回来继续计算

vDom的树形结构并不满足中途暂停，下次继续的需求，需要改造数据结构

解决两个问题：

- 新的任务调度，有高优先级的任务时将浏览器让出来，等浏览器空闲再继续执行
- 新的数据结构可以随时中断，下次可以继续执行

### requestIdleCallback

```js
var handle = window.requestIdleCallback(callback[, options])

window.cancelIdleCallback(handle)
```

requestIdleCallback接收一个回调，这个回调会在浏览器空闲时调用，每次调用会传入一个IdleDeadline，可以拿到当前还空余多久，options可以传入参数最多等多久，等到了时间浏览器还不空就强制执行了。

任务调度的思想就是把任务拆分成多个小任务
代码架子如下：

```js
let nextUnitOfWork;
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 在任务执行完成或者时间不够时结束
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // 如果任务还没完，但是时间到了，我们需要继续注册requestIdleCallback
  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber) {}
requestIdleCallback(workLoop);
```

### Fiber可中断数据结构

fiber加上了指向父节点和兄弟节点的指针

1. **child**: 父节点指向第一个子元素的指针
2. **sibling**: 从第一个子元素往后，指向下一个兄弟元素
3. **return**: 所有子元素都有，指向父元素的指针

fiber遍历——深度优先遍历

根节点先找子元素，没有就找兄弟元素，没有就返回父元素，再找父元素的兄弟元素

```js

// 执行任务，返回下一个任务
function performUnitOfWork(fiber) {
  // 根节点的dom就是container，如果没有这个属性，说明当前fiber不是根节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 如果有父节点，将当前节点挂载到父节点上
  if (fiber.return) {
    fiber.return.dom.appendChild(fiber.dom);
  }

  // 将vDom结构转换为fiber结构
  const elements = fiber.children;
  let prevSibling = null
  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const newFiber = {
        type: element.type,
        props: element.props,
        return: fiber,
        dom: null,
      };

      if (i === 0) {
        fiber.child = newFiber
      } else {
        prevSibling.sibling = newFiber
      }
      prevSibling = newFiber
    }
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.return
  }
}

function createDom() {}
```

### 统一commit DOM操作

避免DOM渲染一半被中断
所以将所有DOM操作都搜集起来，最后统一执行

全局变量```workInProgressRoot```用于记录根节点

```js
let nextUnitOfWork;
let workInProgressRoot;
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 在任务执行完成或者时间不够时结束
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 任务做完后统一渲染
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot()
  }

  // 如果任务还没完，但是时间到了，我们需要继续注册requestIdleCallback
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitRootImpl(workInProgressRoot.child);
  workInProgressRoot = null;
}

function commitRootImpl(fiber) {
  if (!fiber) return;

  const parentDom = fiber.return.dom;
  parentDom.appendChild(fiber.dom);

  // 递归子元素和兄弟元素
  commitRootImpl(fiber.child);
  commitRootImpl(fiber.sibling);
}

```

### reconcile

就是diff

fiber节点里添加一个属性```alternate```指向```currentRoot```，记录上次运行的根节点

currentRoot在第一次render后的commit阶段赋值，也就是每次计算完后都会把当次状态记录在alternate上，后面更新了就可以把alternate拿出来跟新的状态做diff

新增```reconcileChildren```函数，逻辑如下：

1. 如果新老节点类型一样，复用老节点DOM，更新props
2. 如果类型不一样，而且新的节点存在，创建新节点替换老节点
3. 如果类型不一样，没有新节点，有老节点，删除老节点

### useState

全局变量会污染数据，所以将数据存在每个fiber节点上，处理这个节点的时候再将状态放到全局变量用来通讯
