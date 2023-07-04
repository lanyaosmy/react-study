## useEvent RFC

<https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md>

### 什么时候不该使用useEvent

- useEvent 不应该在render的时候调用。可以在effects中调用。（需要在render时调用的方法可以使用useCallback）
- 并非所有从effects中提取的方法都是事件
