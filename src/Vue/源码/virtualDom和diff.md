## VNode类
### VNode类能描述的类型节点
- EmptyVNode: 没有内容的注释节点

- TextVNode: 文本节点

- CloneVNode: 克隆节点，可以是以上任意类型的节点，唯一的区别在于isCloned属性为true

- ComponentVNode: 组件节点

- FunctionalComponent: 函数式组件节点

- ElementVNode: 普通元素节点