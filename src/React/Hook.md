[TOC]

## useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

- dispatch函数仅更新下一次渲染的state
- 通过 ```Object.is()```比较新旧值，如果相同会跳过重新渲染组件和子组件
- 批量状态更新，updates the screen after all the event handlers have run

第三个参数是初始化函数，调用方式为 ```init(initialArg)```

不要重复创建初始对象，下面这种写法会在每次render都调用该方法

```javascript
const [state, dispatch] = useReducer(reducer, createInitialState(username));
```

一个完整例子

```javascript
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}

```

### 自己实现

```javascript
import { useState } from 'react'

export function useReducer(reducer, initialState){
  const [state, setState] = useState(initialState)

  function dispatch(action){
    setState((s) => reducer(s, action))
  }

  return [state, dispatch]
}
```

> 可以使用immer来直接修改对象或数组
> ```import { useImmerReducer } from 'use-immer';```

## useDeferredValue

延迟更新UI的某些部分

### 用法

#### 在新内容加载期间显示旧内容

```javascript
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

#### 表明内容已经过时

加一个视觉提醒

```javascript
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

#### 延迟渲染UI的某些部分

UI重新渲染很慢，使用该方法故意减缓渲染速度

用户输入及时更新，但列表的更新会有延时

```javascript
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}

import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // 仅打印一次。实际的减速是在 SlowItem 组件内部。
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});
```

## useTransition

不阻塞 UI 的情况下来更新状态

```javascript
const [isPending, startTransition] = useTransition()
```

返回值

1. isPending: 是否存在待处理的转换
2. startTransition函数: 可将状态更新标记为转换状态

### 用法

- 将状态更新标记为非阻塞转换状态

```javascript
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

转换状态可以使用户界面更新在慢速设备上仍保持响应性。

通过转换状态，在重新渲染过程中你的用户界面保持响应。例如，如果用户单击一个选项卡，但改变了主意并单击另一个选项卡，他们可以在不等待第一个重新渲染完成的情况下完成操作。


## useRef

ref 和 state 的不同之处 
| ref                                                   | state                                                                                    |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| useRef(initialValue)返回 { current: initialValue }    | useState(initialValue) 返回 state 变量的当前值和一个 state 设置函数 ( [value, setValue]) |
| 更改时不会触发重新渲染                                | 更改时触发重新渲染。                                                                     |
| 可变 —— 你可以在渲染过程之外修改和更新 current 的值。 | “不可变” —— 你必须使用 state 设置函数来修改 state 变量，从而排队重新渲染。               |
| 你不应在渲染期间读取（或写入） current 值。           | 你可以随时读取 state。但是，每次渲染都有自己不变的 state 快照。                          |


原则上 useRef 可以在 useState 的基础上 实现。 你可以想象在 React 内部，useRef 是这样实现的：

```js
// React 内部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

### 何时使用 ref
- 存储 timeout ID
- 存储和操作 DOM 元素
- 存储不需要被用来计算 JSX 的其他对象。
如果你的组件需要存储一些值，但不影响渲染逻辑，请选择 ref。

### 使用flushSync立即同步更新DOM
```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```
在setState后立即操作DOM

从 react-dom 导入 flushSync 并将 state 更新包裹 到 flushSync 调用中
```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```


## useState
渲染会及时生成一张快照 
当 React 重新渲染一个组件时：
- React 会再次调用你的函数
- 函数会返回新的 JSX 快照
- React 会更新界面以匹配返回的快照

```js
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number); //0
        }, 3000); 
      }}>+5</button>
    </>
  )
}
```

一个 state 变量的值永远不会在一次渲染的内部发生变化
React 会使 state 的值始终”固定“在一次渲染的各个事件处理函数内部


### React 会对 state 更新进行批处理 
React 会等到事件处理函数中的 所有 代码都运行完毕再处理你的 state 更新

#### 多次更新同一个State

```js
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        // 3
      }}>+3</button>
    </>
  )
}
```

react将```n => n + 1```三次加入更新队列

#### 在替换后更新state

```js
 <button onClick={() => {
  setNumber(number +5);
  setNumber(n => n + 1);
  // 6
}}>+</button>
```
1. setNumber(number + 5)：number 为 0，所以 setNumber(0 + 5)。React 将 “替换为 5” 添加到其队列中。
2. setNumber(n => n + 1)：n => n + 1 是一个更新函数。 React 将 该函数 添加到其队列中。

以下是你可以考虑传递给 setNumber state 设置函数的内容：

- 一个更新函数（例如：n => n + 1）会被添加到队列中。
- 任何其他的值（例如：数字 5）会导致“替换为 5”被添加到队列中，已经在队列中的内容会被忽略。

## useEffect
useEffect 会在屏幕更新渲染之后执行
React 总是在执行下一轮渲染的 Effect 之前清理上一轮渲染的 Effect
如果 React 的所有依赖项都与上次渲染时的值相同，则将跳过本次 Effect。使用`Object.is()`判断
每一轮渲染都有自己的 Effect 
React 将在下次 Effect 运行之前以及卸载期间这两个时候调用清理函数。



### Effect中请求数据

缺点：
- Effect 不能在服务端执行
- 直接在 Effect 中获取数据容易产生网络瀑布（network waterfall）
- 直接在 Effect 中获取数据通常意味着无法预加载或缓存数据
- [人机竞争](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

请考虑使用或构建客户端缓存。
目前受欢迎的开源解决方案是 React Query(https://tanstack.com/query/latest/docs/framework/react/overview)、useSWR(https://zhuanlan.zhihu.com/p/93824106?utm_id=0) 和 React Router v6.4+。你也可以构建自己的解决方案，在这种情况下，你可以在幕后使用 Effect，但是请注意添加用于删除重复请求、缓存响应和避免网络瀑布（通过预加载数据或将数据需求提升到路由）的逻辑。


### 如何移除不必要的 Effect 

- 不必使用 Effect 来转换渲染所需的数据 ==> 直接计算

如果一个值可以基于现有的 props 或 state 计算得出，不要把它作为一个 state，而是在渲染期间直接计算这个值

- 缓存昂贵的计算 ==> 使用useMemo

```js
// ✅ 除非 todos 或 filter 发生变化，否则不会重新执行 getFilteredTodos()
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
```

- 当 props 变化时重置所有 state ==> 父组件使用Key

```js
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ 当 key 变化时，该组件内的 comment 或其他 state 会自动被重置
  const [comment, setComment] = useState('');
  // ...
}
```

- 当 prop 变化时调整部分 state ==> 在渲染期间直接调整 state

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 避免：当 prop 变化时，在 Effect 中调整 state
  useEffect(() => {
    setSelection(null);
  }, [items]);

  // 好一些：在渲染期间调整 state
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

- 在事件处理函数中共享逻辑 
```js
function ProductPage({ product, addToCart }) {
  // 🔴 避免：在 Effect 中处理属于事件特定的逻辑
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`已添加 ${product.name} 进购物车！`);
    }
  }, [product]);

  // ✅ 非常好：事件特定的逻辑在事件处理函数中处理
  function buyProduct() {
    addToCart(product);
    showNotification(`已添加 ${product.name} 进购物车！`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

- 链式计算,链接多个 Effect，每个 Effect 都基于某些 state 来调整其他的 state ==> 尽可能在渲染期间进行计算，以及在事件处理函数中调整 state

- 初始化应用,有些逻辑只需要在应用加载时执行一次。 ==> 添加一个顶层变量来记录它是否已经执行过了\可以在模块初始化和应用渲染之前执行它
- 通知父组件有关 state 变化的信息 ==> 状态提升
- 将数据传递给父组件 ==> 向子组件传递数据
- 订阅外部 store ==> useSyncExternalStore
- 
