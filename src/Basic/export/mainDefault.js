import { thing, default as defaultThing } from './moduleDefault.js';
import anotherDefaultThing from './moduleDefault.js';

setTimeout(() => {
  console.log(thing); // "changed"
  console.log(defaultThing); // "initial"
  console.log(anotherDefaultThing); // "initial"
}, 1000);

// 默认导出的导入结果是值而不是引用
