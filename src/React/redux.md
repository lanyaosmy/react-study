### combineReducers

```js
function combineReducers(reducers) {
  const stateKeys = Object.keys(reducers);

  return function combine(state, action) {
    const finalState = {};
    for (let i = 0; i < stateKeys.length; i++) {
      const newKey = stateKeys[i];
      const newReducer = reducers[newKey];
      // 从root state中取出指定key的值作为reducer的state
      const prevState = state[newKey];
      finalState[newKey] = newReducer(prevState, action);
    }
    return finalState;
  };
}
```

### applyMiddleware

#### 中间件的逻辑

```js
function logger(store) {
  const { getState } = store;
  return (next) => (action) => {
    const returnValue = next(action);
    console.log('state after dispatch', getState());
    return returnValue;
  };
}
```
>
> 1. 接受store作为参数，返回一个函数
> 2. 返回的函数接受老的dispatch作为参数
> 3. 返回的新函数就是新的dispatch函数

#### createStore

```js
createStore(reducer, [preloadedState], [enhancer])
```

enhancer定义：

```js
type StoreEnhancer = (next: StoreCreator) => StoreCreator
```

#### 单个middleware

```js
function applyMiddleware(middleware) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    const nextDispatch = middleware(store)(store.dispatch);
    return { ...store, dispatch: nextDispatch };
  };
}
```

#### 官方实现

```js
export default function applyMiddleware<Ext, S = any>(
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: Ext }>
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  return (createStore: StoreEnhancerStoreCreator) =>
    <S, A extends AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>
    ) => {
      const store = createStore(reducer, preloadedState)
      let dispatch: Dispatch = () => {
        throw new Error(
          'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.'
        )
      }

      const middlewareAPI: MiddlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
}
```

```ts
/**
 * `compose(f, g, h)` is identical to doing  `(...args) => f(g(h(...args)))`
 */
export function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return <T>(arg: T) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args))
  )
}
```
