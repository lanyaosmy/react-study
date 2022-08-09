import { thing as importedThing } from './module.js';
const fn = async () => {
  const module = await import('./module.js');
  let { thing } = await import('./module.js');

  setTimeout(() => {
    console.log(importedThing); // "changed"
    console.log(module.thing); // "changed"
    console.log(thing); // "initial"
  }, 1000);
};
fn();
// 对命名导出来说，前两种是引用，第三种是值。
