/*
 * @lc app=leetcode.cn id=57 lang=javascript
 *
 * [57] 插入区间
 *
 * https://leetcode.cn/problems/insert-interval/description/
 *
 * algorithms
 * Medium (42.67%)
 * Likes:    855
 * Dislikes: 0
 * Total Accepted:    189.2K
 * Total Submissions: 443.2K
 * Testcase Example:  '[[1,3],[6,9]]\n[2,5]'
 *
 * 给你一个 无重叠的 ，按照区间起始端点排序的区间列表。
 * 
 * 在列表中插入一个新的区间，你需要确保列表中的区间仍然有序且不重叠（如果有必要的话，可以合并区间）。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：intervals = [[1,3],[6,9]], newInterval = [2,5]
 * 输出：[[1,5],[6,9]]
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
 * 输出：[[1,2],[3,10],[12,16]]
 * 解释：这是因为新的区间 [4,8] 与 [3,5],[6,7],[8,10] 重叠。
 * 
 * 示例 3：
 * 
 * 
 * 输入：intervals = [], newInterval = [5,7]
 * 输出：[[5,7]]
 * 
 * 
 * 示例 4：
 * 
 * 
 * 输入：intervals = [[1,5]], newInterval = [2,3]
 * 输出：[[1,5]]
 * 
 * 
 * 示例 5：
 * 
 * 
 * 输入：intervals = [[1,5]], newInterval = [2,7]
 * 输出：[[1,7]]
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 0 
 * intervals[i].length == 2
 * 0 
 * intervals 根据 intervals[i][0] 按 升序 排列
 * newInterval.length == 2
 * 0 
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function (intervals, newInterval) {
  let len = intervals.length
  let [a, b] = newInterval
  let start = 0, end = 0, arr = newInterval.slice()
  let i = 0
  let flag = false
  while (i < len) {
    let [m, n] = intervals[i]
    if (!flag && ((a >= m && a <= n) || (a <= m && b >= m))) {
      start = i
      flag = true
      arr[0] = Math.min(a, m)

    }
    if (flag && (b >= m && (i === len - 1 ? true : b < intervals[i + 1][0]))) {
      end = i
      arr[1] = Math.max(b, n)
    }
    i++
  }
  console.log(flag, arr, start, end);
  if (flag) {
    intervals.splice(start, end - start + 1, arr)
  } else {
    intervals.push(newInterval)
    intervals.sort((a, b) => a[0] - b[0])
  }
  return intervals
};
insert([[1, 5], [6, 8]], [0, 9])
// insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8])
// @lc code=end

