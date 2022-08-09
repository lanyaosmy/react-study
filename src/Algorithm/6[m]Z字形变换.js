/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function (s, numRows) {
  if (numRows === 1) return s;
  let m = 0,
    n = 2 * numRows - 1;
  let len = s.length;
  let arr = new Array(numRows).fill('');
  let plus = true;
  for (let i = 0; i < len; i++) {
    arr[m] += s.charAt(i);
    if (plus) {
      m++;
    } else {
      m--;
    }
    if (m >= Math.floor(n / 2)) {
      plus = false;
    }
    if (m <= 0) {
      plus = true;
    }
  }
  let r = arr.join('');
  return r;
};
var convert2 = function (s, numRows) {
  if (numRows <= 1) {
    return s;
  }
  let group = 2 * numRows - 2;
  let len = s.length;
  let map = new Array(numRows).fill('');
  for (let i = 0; i < len; i++) {
    let target = i % group <= numRows - 1 ? i % group : group - (i % group);
    map[target] += s.charAt(i);
  }
  return map.join('');
};
