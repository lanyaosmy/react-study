import React, {
  useReducer,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';

const initialState = { count: 0 };
function init(initialCount) {
  return { count: initialCount };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset': {
      return init(action.payload);
    }
    default:
      return state;
  }
}

export function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mIncrement = useCallback(() => {
    dispatch({ type: 'increment' });
  }, []);
  const [count, setCount] = useState(initialCount);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(0)}>reset</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <p>{state.count}</p>
      <button
        onClick={() => dispatch({ type: 'reset', payload: initialCount })}
      >
        reset
      </button>
      <button onClick={mIncrement}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}

export function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input type="text" ref={inputEl} />
      <button onClick={onButtonClick}>focus</button>
    </>
  );
}

export function IntervalCounter() {
  const [count, setCount] = useState(0);
  /**
   * 定时器会被不断重置
   */
  // useEffect(() => {
  //   console.log('init');
  //   const id = setInterval(() => {
  //     setCount(count + 1);
  //   }, 1000);
  //   return () => {
  //     console.log('clear');
  //     clearInterval(id);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [count]);
  useEffect(() => {
    console.log('init');
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => {
      console.log('clear');
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <h1>{count}</h1>;
}
