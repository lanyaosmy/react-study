![事件循环](https://tva1.sinaimg.cn/large/e6c9d24ely1h6k3l4i0guj20ph0cwabf.jpg)

> 1. 一个Event Loop可以有一个或多个事件队列，但只有一个微任务队列
> 2. 微任务队列全部执行完会重新渲染一次
> 3. 每个宏任务执行完都会重新渲染一次
> 4. requestAnimationFrame处于渲染阶段，不在微任务队列，也不在宏任务队列
