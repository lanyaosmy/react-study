[toc]

## Set

类似于数组，但是成员的值都是唯一的，没有重复的值。

let...of遍历

Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是向 Set 加入值时认为NaN等于自身，而精确相等运算符认为NaN不等于自身。

### 属性和方法

- 属性：constructor和size

- 方法：add(v)/delete(v)/has(v)/clear()

- 遍历操作：keys()/values()/entries()/forEach()

Set的遍历顺序就是插入顺序

扩展运算符（...）内部使用for...of循环，所以也可以用于 Set 结构。

Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 交集
let union = new Set([...a, ...b]);
// 交集
let intersect = new Set([...a].filter((v) => b.has(v)));
// a 相对于 b的差集
let difference = new Set([...a].filter((v) => !b.has(v)));
```

### WeakSet

- WeakSet 的成员只能是对象，而不能是其他类型的值。

- WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

## Map

传统对象只能用字符串当键

Map各种类型的值（包括对象）都可以当作键

### WeakMap

- WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
- WeakMap的键名所指向的对象，不计入垃圾回收机制。一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用

- WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

```js
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
console.log(wm.get(key))
// Object {foo: 1}
```

WeakMap只有四个方法可用：```get()```、```set()```、```has()```、```delete()```。

### WeakMap用途

- DOM 节点作为键名，不存在内存泄漏的风险
- 部署私有属性
