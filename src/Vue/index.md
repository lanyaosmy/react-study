[自己实现一个VUE响应式--VUE响应式原理](https://juejin.cn/post/6844904048911450126)

### diff

![diff图解](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9acb9b068a9b42c98815218807f3de76~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

patchVnode伪代码

```js
patchVnode(oldVnode, vnode){
  const el = vnode.el = oldVnode;
  let i, oldCh = oldVnode.children, ch = vnode.children;

  if(oldVnode === vnode) return;

  if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text){
    // 仅仅是文字改变，更新文字
    setTextContext(el, vnode.text);
  }else{
    updateEle();

    if(oldCh && ch && oldCh!== ch){
       // 都有子元素，但是变化了
       updateChildren();
    }else if(ch){
      // 新的有子元素, 老的没有，创建新元素
      createEl(vnode);
    }else if(oldCh){
      // 老的有子元素，新的没有，删除老元素
      removeChildren(el);
    }
  }
}
```
