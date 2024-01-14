var rotate = function (matrix) {
  let n = matrix.length
  let m = Math.ceil(n / 2)
  let k = Math.floor(n / 2)

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < k; j++) {
      let start = matrix[i][j]
      matrix[i][j] = matrix[n - j - 1][i]
      matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1]
      matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1]
      matrix[j][n - i - 1] = start
      // console.log(i, j, n - j - 1, matrix.join());
    }
  }
  // console.log(matrix);
};
rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]])


//49. 字母异位词分组
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
  // let codeMap={}
  let len = strs.length
  let resultMap = {}
  for (let i = 0; i < len; i++) {
    let str = strs[i].split('')
    str.sort()
    // console.log(str)
    if (resultMap[str]) {
      resultMap[str].push(strs[i])
    } else {
      resultMap[str] = [strs[i]]
    }
  }
  // console.log(resultMap)
  return Object.values(resultMap)
};


// 50.pow(x,n)
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {

};


// 53. 最大子数组和
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  // nums = [5,4,-1,7,8]
  let max = nums[0]
  let len = nums.length
  let arr = [nums[0]]
  for (let i = 1; i < len; i++) {
    let a = nums[i] + arr[i - 1]
    arr[i] = Math.max(a, nums[i])
    // console.log(arr, a)
    max = Math.max(a, max)
  }
  return max
};

maxSubArray([])

//54. 螺旋矩阵
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
  let result = []
  let m = matrix.length, n = matrix[0].length
  let i = 0, j = 0
  let direction = [1, 2, 3, 4]// 右，下，左，上
  let currD = 0
  while (i < m && j < n && matrix[i][j] !== null) {

    let newI = i, newJ = j
    if (direction[currD] === 1) {
      newJ = j + 1
    } else if (direction[currD] === 2) {
      newI = i + 1
    } else if (direction[currD] === 3) {
      newJ = j - 1
    } else if (direction[currD] === 4) {
      newI = i - 1
    }
    if ((newJ === n || newI === m || newJ === -1) || (matrix[newI][newJ] === null && result.length < m * n - 1)) {
      currD = (currD + 1) % 4
    } else {
      result.push(matrix[i][j])
      matrix[i][j] = null
      i = newI
      j = newJ
    }
    console.log(result, currD, `${i},${j}`, `${newI},${newJ}`, matrix);
  }
  return result
};
spiralOrder([[2, 5], [8, 4], [0, -1]])