
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
