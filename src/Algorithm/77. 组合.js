// 给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  let arr = [1]
  for (let i = 1; i < n; i++) {
    arr.push(i + 1)
  }
  //   console.log(arr)
  let result = []
  const dfs = (ind, depth, path) => {
    if (depth === 0) {
      result.push(path.slice(0))
      return
    }
    for (let i = ind; i < n - depth + 1; i++) {
      path.push(arr[i])
      //   console.log("递归之前 => " +`${i}, `+ path)
      dfs(i + 1, depth - 1, path)
      path.pop()
      //   console.log("递归之后 => "+`${i}, `+ path)
    }
  }
  dfs(0, k, [])
  return result
};

