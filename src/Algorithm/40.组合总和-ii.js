/*
 * @lc app=leetcode.cn id=40 lang=javascript
 *
 * [40] 组合总和 II
 *
 * https://leetcode.cn/problems/combination-sum-ii/description/
 *
 * algorithms
 * Medium (59.50%)
 * Likes:    1497
 * Dislikes: 0
 * Total Accepted:    484.9K
 * Total Submissions: 814.9K
 * Testcase Example:  '[10,1,2,7,6,1,5]\n8'
 *
 * 给定一个候选人编号的集合 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。
 * 
 * candidates 中的每个数字在每个组合中只能使用 一次 。
 * 
 * 注意：解集不能包含重复的组合。 
 * 
 * 
 * 
 * 示例 1:
 * 
 * 
 * 输入: candidates = [10,1,2,7,6,1,5], target = 8,
 * 输出:
 * [
 * [1,1,6],
 * [1,2,5],
 * [1,7],
 * [2,6]
 * ]
 * 
 * 示例 2:
 * 
 * 
 * 输入: candidates = [2,5,2,1,2], target = 5,
 * 输出:
 * [
 * [1,2,2],
 * [5]
 * ]
 * 
 * 
 * 
 * 提示:
 * 
 * 
 * 1 <= candidates.length <= 100
 * 1 <= candidates[i] <= 50
 * 1 <= target <= 30
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
  let len = candidates.length;
  let result = [];
  candidates.sort((a, b) => a - b);
  const dfs = (arr, path, num, start) => {
    console.log(path)
    if (num === 0) {
      result.push(path.slice())
      return
    }
    for (let i = start; i < len; i++) {
      if (num < arr[i]) {
        break
      }
      // 限制相等元素在每一轮中只被选择一次
      if (i > start && arr[i] === arr[i - 1]) {
        continue
      }
      path.push(arr[i])
      // i+1 每个数组元素只能被选择一次
      dfs(arr, path, num - arr[i], i + 1)
      path.pop()
    }
  }
  dfs(candidates, [], target, 0)
  return result
};
// @lc code=end

