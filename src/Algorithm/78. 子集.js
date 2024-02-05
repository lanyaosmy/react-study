/**
 * 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。

解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。


 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
  nums.sort((a, b) => a - b)
  let len = nums.length
  let result = []
  const trans = (begin, depth, path) => {

    result.push(path.slice())
    if (depth === len) return
    for (let i = begin; i < len; i++) {
      path.push(nums[i])
      trans(i + 1, depth + 1, path)
      path.pop()
    }

  }
  trans(0, 0, [])
  return result
};