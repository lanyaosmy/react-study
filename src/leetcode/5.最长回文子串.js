/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 *
 * https://leetcode.cn/problems/longest-palindromic-substring/description/
 *
 * algorithms
 * Medium (37.66%)
 * Likes:    6683
 * Dislikes: 0
 * Total Accepted:    1.5M
 * Total Submissions: 3.9M
 * Testcase Example:  '"babad"'
 *
 * 给你一个字符串 s，找到 s 中最长的回文子串。
 *
 * 如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。
 *
 *
 *
 * 示例 1：
 *
 *
 * 输入：s = "babad"
 * 输出："bab"
 * 解释："aba" 同样是符合题意的答案。
 *
 *
 * 示例 2：
 *
 *
 * 输入：s = "cbbd"
 * 输出："bb"
 * 提示：
 * 1 <= s.length <= 1000
 * s 仅由数字和英文字母组成
 */

// @lc code=start
function trans(arr, l, r) {
  while (l >= 0 && r < arr.length && arr[l] === arr[r]) {
    --l;
    ++r;
  }
  return arr.slice(l + 1, r).join('');
}
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  let arr = s.split('');
  let maxStr = '';
  for (let i = 0; i < arr.length; i++) {
    let curr = arr[i];
    let j = i + 1;
    while (j < arr.length && arr[j] === curr) j++;
    let str = trans(arr, i, j - 1);
    if (str.length > maxStr.length) {
      maxStr = str;
    }
    i += j - i - 1;
  }
  return maxStr;
};
// @lc code=end
