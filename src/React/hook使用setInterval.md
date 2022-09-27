
# Hook中使用setInterval

```js
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
}
// count始终为1
```

因为useEffect的依赖为空，只会执行一次，setInterval中拿到的是第一次渲染时的闭包，count一直是0

如果在依赖里加count，会导致重复新增和删除定时器，性能不好

## 方法一 函数式更新

```js
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((v) => v + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
}

```

## 方法二 useRef

```js
function Counter() {
  const [count, setCount] = useState(0);
  const cbRef = useRef<() => void>();
  cbRef.current = () => {
    setCount(count + 1);
  };
  useEffect(() => {
    const id = setInterval(() => {
      if (cbRef.current) cbRef.current();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
}

```

> Q: 为什么不直接setInterval(cbRef.current, 1000)这样写不行呢,还要包个方法返回？
> A: 因为这样取的还是之前的值

### 自定义Hook

```ts
function useInterval(fn, time) {
  const cbRef = useRef<() => void>();
  useEffect(() => {
    cbRef.current = fn;
  }, [fn]);
  useEffect(() => {
    const id = setInterval(() => {
      if (cbRef.current) cbRef.current();
    }, time);
    return () => {
      clearInterval(id);
    };
  }, []);
}
```

## 方法三 使用useReducer

```ts
function reducer(state, action) {
  const { type } = action;
  switch (type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      throw new Error();
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'increment' });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
  return <h1 style={{ color: 'white' }}>{state.count}</h1>;
}
```
