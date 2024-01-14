/*
 * @lc app=leetcode.cn id=39 lang=javascript
 *
 * [39] 组合总和
 */

// @lc code=start
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
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
            path.push(arr[i])
            dfs(arr, path, num - arr[i], i + 1)
            path.pop()
        }
    }
    dfs(candidates, [], target, 0)
    return result
};
// @lc code=end

