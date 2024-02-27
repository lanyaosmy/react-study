/**
 * flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
 * var newArray = arr.flat([depth])
 * depth: 指定要提取嵌套数组的结构深度，默认值为 1。
 */

((log) => {
  if (!log) return;
  console.log('================flat===============');
  let arr = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];

  console.log('MDN:', arr.flat(2));

  function flat(arr, depth = 1) {
    // reduce+递归
    // return arr.reduce((acc, val) => {
    //   return Array.isArray(val) && depth
    //     ? acc.concat(flat(val, depth - 1))
    //     : acc.concat(val);
    // }, []);
    let stack = arr.map(v => ({ value: v, dep: 0 }))
    let result = []
    while (stack.length) {
      let { value, dep } = stack.pop()
      if (Array.isArray(value) && dep < depth) {
        stack.push(...value.map(v => ({ value: v, dep: dep + 1 })))
      } else {
        result.push(value)
      }
    }
    result.reverse()
    return result
  }
  console.log('FLAT:', flat(arr, Infinity));
})(false);

/**
 * 数据去重
 */

((log) => {
  if (!log) return;
  console.log('================unique===============');
  const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}];

  function unique(arr) {
    // return Array.from(new Set(arr));
    let newArr = [];
    for (let index = 0; index < arr.length; index++) {
      let v = arr[index];
      if (newArr.indexOf(v) === -1) {
        newArr.push(v);
      }
    }
    return newArr;
  }
  console.log('arr', unique(arr));
})(false);

/**
 * filter
 * filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。
 * var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
 */

((log) => {
  if (!log) return;
  console.log('================filter===============');
  const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}];

  Array.prototype._filter = function (callback, thisArg) {
    if (typeof callback !== 'function' || !this) {
      throw TypeError('WTF');
    }
    let array = this;
    let result = [],
      len = array.length >>> 0; // 保证len为number，且为正整数;
    for (let index = 0; index < len; index++) {
      if (index in this) {
        let element = array[index];
        if (callback.call(thisArg ? thisArg : this, element, index, array)) {
          result.push(element);
        }
      }
    }
    return result;
  };
  console.log(arr._filter((v) => v));
})(false);

// map和forEach同理

/**
 * reduce
 * reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
 * arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
 */

((log) => {
  if (!log) return;
  console.log('================reduce===============');
  const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}];

  Array.prototype._reduce = function (callback, initialValue) {
    if (typeof callback !== 'function' || !this) {
      throw TypeError('WTF');
    }
    var array = Object(this);
    var len = this.length >>> 0;
    var k = 0;
    var value;
    if (arguments.length >= 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in array)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array ' + 'with no initial value');
      }
      value = array[k++];
    }
    while (k < len) {
      if (k in array) {
        value = callback(value, array[k], k, array);
      }
      k++;
    }
    return value;
  };
  console.log(
    arr._reduce((acc, val) => acc + val),
    arr.reduce((acc, val) => acc + val)
  );
})(true);
