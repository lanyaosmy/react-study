import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

/**
 * 在使用 useSelector 时使用单行箭头函数，会导致在每次渲染期间都会创建一个新的 selector 函数。
 */
export const TodoListItem = (props) => {
  const todo = useSelector((state) => state.todos[props.id])
  return <div>{todo.text}</div>
}

/**
 * 当一个 selector 函数依赖于某个 状态(state) 时，确保函数声明在组件之外，
 * 这样就不会导致相同的 selector 函数在每一次渲染时都被重复创建
 */
const selectNumOfDoneTodos = createSelector(
  (state) => state.todos,
  (todos) => todos.filter((todo) => todo.isDone).length,
)

export const DoneTodosCounter = () => {
  const NumOfDoneTodos = useSelector(selectNumOfDoneTodos)
  return <div>{NumOfDoneTodos}</div>
}

/**
 * 这种做法同样适用于依赖组件 props 的情况，但是仅适用于单例的组件的形式
 */

const selectNumOfTodosWithIsDoneValue = createSelector(
  (state) => state.todos,
  (_, isDone) => isDone,
  (todos, isDone) => todos.filter((todo) => todo.isDone === isDone).length,
)

export const TodoCounterForIsDoneValue = ({ isDone }) => {
  const NumOfTodosWithIsDoneValue = useSelector((state) =>
    selectNumOfTodosWithIsDoneValue(state, isDone),
  )
  return <div>{NumOfTodosWithIsDoneValue}</div>
}

/**
 * 如果要在多个组件实例中使用相同的依赖组件props的selector函数，必须确保每一个组件实例创建属于自己的selector函数
 *
 */

const makeNumOfTodosWithIsDoneSelector = () =>
  createSelector(
    (state) => state.todos,
    (_, isDone) => isDone,
    (todos, isDone) => todos.filter((todo) => todo.isDone === isDone).length,
  )
export const TodoCounterForIsDoneValue2 = ({ isDone }) => {
  const selectNumOfTodosWithIsDone = useMemo(makeNumOfTodosWithIsDoneSelector, [])
  const numOfTodosWithIsDoneValue = useSelector((state) =>
    selectNumOfTodosWithIsDone(state, isDone),
  )
  return <div>{numOfTodosWithIsDoneValue}</div>
}

/**
 * createSelector
 */
// const shopItemSelector = (state) => state.shop.items
// const taxPercentSelector = (state) => state.shop.taxPercent

// const subtotalSelector = createSelector(shopItemSelector, (items) =>
//   items.reduce((acc, item) => acc + item.value, 0),
// )

// const taxSelector = createSelector(
//   subtotalSelector,
//   taxPercentSelector,
//   (subtotal, taxPercent) => subtotal * (taxPercent / 100),
// )

// const totalSelector = createSelector(subtotalSelector, taxSelector, (subtotal, tax) => ({
//   total: subtotal + tax,
// }))

// let state = {
//   shop: {
//     taxPercent: 8,
//     items: [
//       { name: 'apple', value: 1.2 },
//       { name: 'orange', value: 0.95 },
//     ],
//   },
// }

// console.log(subtotalSelector(state))
// console.log(taxSelector(state))
// console.log(totalSelector(state))
// function reducer(state, action) {
//   switch (action.type) {
//     case 'setCount': {
//       return {
//         ...state,
//         count: action.setCount(state.count),
//       }
//     }
//     default:
//       return state
//   }
// }
