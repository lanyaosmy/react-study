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

```js
createStore(reducer, [preloadedState], [enhancer])
```

enhancer定义：

```js
type StoreEnhancer = (next: StoreCreator) => StoreCreator
```
