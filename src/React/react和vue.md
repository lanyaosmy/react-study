## react和vue区别

- 数据流动:

  - React 采用单向数据流，意味着视图(View)的变更反应在模型(Model)上，反过来却不行。这种方式使得状态预测和理解更容易。
  - Vue 则默认双向数据绑定，也就是说，模型的改变能自动更新视图，视图的改变也能直接影响模型。同时 Vue 也支持单向数据流，更适合大型项目开发。

- HTML & CSS:

  - React将 HTML 和 CSS 定义在 JavaScript中，即使 JavaScript、HTML 和 CSS 混写在一起，也不违背 React 的设计初衷。
  - Vue 则倾向于在单文件组件中将HTML、JavaScript和 CSS 语言分别拆分，这种方式更接近传统的网页开发方式，对于很多开发者来说更易入门。

- 灵活性和响应式机制:

  - React 更偏向于“函数式编程”，用户有更多的灵活性，可以使用各种第三方库。
  - Vue在设计时就考虑到了响应式机制，它利用依赖追踪在 getter 中收集依赖，派发更新时，在 setter 触发依赖。