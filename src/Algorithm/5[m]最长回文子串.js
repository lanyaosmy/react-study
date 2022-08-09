/**
 * @param {string} s
 * @return {string}
 */
function transverse(s, left, right) {
  while (left >= 0 && right < s.length && s.charAt(left) === s.charAt(right)) {
    --left;
    ++right;
  }
  return s.substring(left + 1, right);
}
var longestPalindrome = function (s) {
  let max = '';
  let len = s.length;
  for (let i = 0; i < len; i++) {
    let j = i + 1;
    const ch = s.charAt(i);
    while (j < s.length && s.charAt(j) === ch) {
      j++;
    }
    let len = transverse(s, i, j - 1 === i ? i : j - 1);
    if (len.length > max.length) {
      max = len;
    }
    i += j - i - 1;
  }
  return max;
};
