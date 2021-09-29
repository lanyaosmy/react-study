import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  )
}
/**
 * 在将一个使用了 dispatch 函数的回调函数传递给子组件时，建议使用 useCallback 函数将回调函数记忆化，防止因为回调函数引用的变化导致不必要的渲染。
 * 译者注：这里的建议其实和 dispatch 没关系，无论是否使用 dispatch，你都应该确保回调函数不会无故变化，然后导致不必要的重渲染。之所以和 dispatch 没关系，是因为，一旦 dispatch 变化，useCallback 会重新创建回调函数，回调函数的引用铁定发生了变化，然而导致不必要的重渲染。
 */

export const CounterComponent2 = ({ value }) => {
  const dispatch = useDispatch()
  const incrementCounter = useCallback(() => dispatch({ type: 'increment' }), [dispatch])
  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onClick={incrementCounter} />
    </div>
  )
}

export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>+</button>
))
