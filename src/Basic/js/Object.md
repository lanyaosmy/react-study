### Object.getOwnPropertyNames()

**Object.getOwnPropertyNames()**方法返回一个由指定对象的所有**自身属性**的属性名（包括**不可枚举属性**但不包括 Symbol 值作为名称的属性）组成的数组。

### Object.getOwnPropertySymbols()

返回一个给定对象自身的所有 Symbol 属性的数组。

### Object.prototype.hasOwnProperty()

所有继承了 Object 的对象都会继承到 hasOwnProperty 方法。这个方法可以用来检测一个对象是否含有特定的自身属性；和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。
