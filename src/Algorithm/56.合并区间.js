/*
 * @lc app=leetcode.cn id=56 lang=javascript
 *
 * [56] 合并区间
 *
 * https://leetcode.cn/problems/merge-intervals/description/
 *
 * algorithms
 * Medium (49.70%)
 * Likes:    2215
 * Dislikes: 0
 * Total Accepted:    766.9K
 * Total Submissions: 1.5M
 * Testcase Example:  '[[1,3],[2,6],[8,10],[15,18]]'
 *
 * 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi]
 * 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
 * 输出：[[1,6],[8,10],[15,18]]
 * 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：intervals = [[1,4],[4,5]]
 * 输出：[[1,5]]
 * 解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= intervals.length <= 10^4
 * intervals[i].length == 2
 * 0 <= starti <= endi <= 10^4
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  // [[1,3],[2,6],[8,10],[15,18]]
  // [[1,4],[0,4]]
  intervals.sort((a, b) => a[0] - b[0])
  let len = intervals.length
  let result = []
  for (let i = 0; i < len; i++) {
    const [n, m] = intervals[i]
    let flag = false
    for (let j = 0; j < result.length; j++) {
      const [n1, m1] = result[j]
      console.log('**', n, m, n1, m1)
      if ((n >= n1 && n <= m1) || (m >= n1 && m <= m1) || (n <= n1 && m >= m1) || (n >= n1 && m <= m1)) {
        result[j] = [Math.min(n, n1), Math.max(m, m1)]
        flag = true
        console.log('--', result[j])
        break
      }
    }
    if (!flag) {
      result.push(intervals[i])
    }
    // console.log(1, result)
  }
  // console.log(result)
  return result
};

merge([[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]])
// @lc code=end

