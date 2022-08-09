let thing = 'initial';
// export { thing };
// export default thing;

// 导出的都是引用
export { thing, thing as default };
setTimeout(() => {
  thing = 'changed';
}, 500);
