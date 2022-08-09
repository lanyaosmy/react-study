# react-loadable

动态加载组件的高阶组件

```js
const AsyncAbout = Loadable({
  loader: () => import('../components/About/About'),
  loading: LoadingPage,
  delay: 300
})
```
