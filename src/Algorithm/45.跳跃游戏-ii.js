/*
 * @lc app=leetcode.cn id=45 lang=javascript
 *
 * [45] 跳跃游戏 II
 *
 * https://leetcode.cn/problems/jump-game-ii/description/
 *
 * algorithms
 * Medium (44.71%)
 * Likes:    2398
 * Dislikes: 0
 * Total Accepted:    601.6K
 * Total Submissions: 1.3M
 * Testcase Example:  '[2,3,1,1,4]'
 *
 * 给定一个长度为 n 的 0 索引整数数组 nums。初始位置为 nums[0]。
 * 
 * 每个元素 nums[i] 表示从索引 i 向前跳转的最大长度。换句话说，如果你在 nums[i] 处，你可以跳转到任意 nums[i + j]
 * 处:
 * 
 * 
 * 0 <= j <= nums[i] 
 * i + j < n
 * 
 * 
 * 返回到达 nums[n - 1] 的最小跳跃次数。生成的测试用例可以到达 nums[n - 1]。
 * 
 * 
 * 
 * 示例 1:
 * 
 * 
 * 输入: nums = [2,3,1,1,4]
 * 输出: 2
 * 解释: 跳到最后一个位置的最小跳跃数是 2。
 * 从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
 * 
 * 
 * 示例 2:
 * 
 * 
 * 输入: nums = [2,3,0,1,4]
 * 输出: 2
 * 
 * 
 * 
 * 
 * 提示:
 * 
 * 
 * 1 <= nums.length <= 10^4
 * 0 <= nums[i] <= 1000
 * 题目保证可以到达 nums[n-1]
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 * DFS
 */
var jump = function (nums) {
  const len = nums.length
  if (len === 1) return 0
  let result = len

  function trans(curr, count) {
    const step = nums[curr]
    let l = curr + 1, r = curr + step < len ? curr + step : len - 1
    let max = 0, maxI = r
    for (let i = l; i <= r; i++) {
      if (i === len - 1) {
        // console.log(count)
        result = Math.min(result, count)
      }
      if (i + nums[i] > max) {
        max = i + nums[i]
        maxI = i
      }
    }
    trans(maxI, count + 1)
  }
  trans(0, 1)
  return result


  // const len = nums.length
  // if (len === 1) return 0
  // let result = len

  // function trans(curr, count) {
  //   const step = nums[curr]
  //   let l = curr + 1, r = curr + step < len ? curr + step : len - 1
  //   for (let i = l; i <= r; i++) {
  //     if (i === len - 1) {
  //       // console.log(count)
  //       result = Math.min(result, count)
  //     } else {
  //       trans(i, count + 1)
  //     }
  //   }
  // }
  // trans(0, 1)
  // return result

};
// @lc code=end


// 46.全排列
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  let len = nums.length
  let result = []
  const trans = (depth, path, used) => {
    if (depth >= len) {
      result.push(path.slice())
      return
    }
    for (let i = 0; i < len; i++) {
      if (used[i]) continue
      path.push(nums[i])
      used[i] = true
      trans(depth + 1, path, used)
      path.pop();
      used[i] = false;
    }

  }
  if (!len) {
    return [];
  }
  trans(0, [], [])
  return result
};


// 48.旋转图像
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  let n = matrix.length
  let m = Math.ceil(n / 2)

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= m; j++) {
      let start = matrix[i][j]
      matrix[i][j] = matrix[n - j - 1][i]
      matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1]
      matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1]
      matrix[j][n - i - 1] = start
      console.log(matrix);
    }
  }
  console.log(matrix);
};
rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]])