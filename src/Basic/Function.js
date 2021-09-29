/**
 * apply
 */
((log) => {
  if (!log) return;
  console.log('================apply===============');
  let obj = {
    a: 2,
  };
  Function.prototype._apply = function (context = window) {
    if (typeof this !== 'function') {
      throw new TypeError('Type Error');
    }
    context.fn = this;
    let res = context.fn(...arguments[1]);
    delete context.fn;
    return res;
  };
})(true);
