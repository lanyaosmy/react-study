function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

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

let nextUnitOfWork;
let workInProgressRoot;
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 在任务执行完成或者时间不够时结束
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 任务做完后统一渲染
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();
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
  // parentDom.appendChild(fiber.dom);

  if (fiber.effectTag === 'REPLACEMENT' && fiber.dom) {
    parentDom.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'DELETION') {
    parentDom.removeChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  // 递归子元素和兄弟元素
  commitRootImpl(fiber.child);
  commitRootImpl(fiber.sibling);
}

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
  let prevSibling = null;
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
        fiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
    }
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function updateFunctionComponent(fiber) {
  // 支持useState，初始化变量
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // hooks用来存储具体的state序列

  // 函数组件的type就是个函数
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber); // 创建一个DOM挂载上去
  }

  // 将我们前面的vDom结构转换为fiber结构
  const elements = fiber.props.children;

  // 调和子元素
  reconcileChildren(fiber, elements);
}

function createDom() {}
function updateDom(dom, prevProps, nextProps) {
  // 过滤children属性
  // 新的没有，删掉旧的
  // 新的有，老的没有，新增

  Object.keys(prevProps)
    .filter((v) => v !== 'children')
    .filter((v) => !(v in nextProps))
    .forEach((name) => {
      if (name.indexOf('on') === 0) {
        dom.removeEventListener(
          name.substr(2).toLowerCase(),
          prevProps[name],
          false,
        );
      } else {
        dom[name] = '';
      }
    });

  Object.keys(nextProps)
    .filter((v) => v !== 'children')
    .forEach((name) => {
      if (name.indexOf('on') === 0) {
        dom.addEventListener(
          name.substr(2).toLowerCase(),
          nextProps[name],
          false,
        );
      } else {
        dom[name] = nextProps[name];
      }
    });
}
requestIdleCallback(workLoop);

let workInProgressFiber = null;
let deletions = [];
function reconcileChildren(oldFiber, element) {
  let newFiber = null;
  // 对比oldFiber和当前element
  const sameType = oldFiber && element && oldFiber.type === element.type;
  if (sameType) {
    // 类型相同
    newFiber = {
      type: oldFiber.type,
      props: element.props,
      dom: oldFiber.dom,
      return: workInProgressFiber,
      alternate: oldFiber, // 记录上次状态
      effectTag: 'UPDATE', // 添加“更新”标记
    };
  } else if (element) {
    // 类型不一样，有新节点，创建新节点替换老节点
    newFiber = {
      type: element.type,
      props: element.props,
      dom: null,
      return: workInProgressFiber,
      alternate: null,
      effectTag: 'REPLACEMENT',
    };
  } else if (oldFiber) {
    // 没有新节点，有老节点，删除老节点
    oldFiber.effectTag = 'DELETION';
    deletions.push(oldFiber);
  }
}

let currentRoot = {};

// let state = [];
let wipFiber = null; // 当前的函数组件fiber节点
let hookIndex = null; // hookIndex是当前函数组件内部useState状态计数

function useState(init) {
  // 函数组件的hooks队列在fiber节点上，所以从fiber.alternate上取上次的值
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const currentIndex = hookIndex;

  state[currentIndex] =
    state[currentIndex] === null ? init : state[currentIndex];
  const setState = (value) => {
    state[currentIndex] = value;

    // 只要修改了state，就需要重新处理节点
    workInProgressRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };

    // 修改nextUnitOfWork指向workInProgressRoot，这样下次就会处理这个节点了
    nextUnitOfWork = workInProgressRoot;
    deletions = [];
  };

  hookIndex++;
  return [state[currentIndex], setState];
}

// 全局变量会污染数据，所以将数据存在每个fiber节点上，
