/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
  let row = binarySearchColumn(matrix, target)
  if (row < 0) return false
  return binarySearch(matrix[row], target)

};

var binarySearchColumn = (matrix, target) => {
  let l = -1, r = matrix.length - 1
  while (l < r) {
    let mid = Math.floor((r - l + 1) / 2) + l
    if (matrix[mid][0] <= target) {
      l = mid
    } else {
      r = mid - 1
    }
  }
  return l
}

var binarySearch = (arr, target) => {
  let l = 0, r = arr.length - 1
  while (l <= r) {
    let mid = Math.floor((r - l) / 2) + l
    let curr = arr[mid]
    if (curr === target) {
      return true
    } else if (curr > target) {
      r = mid - 1
    } else {
      l = mid + 1
    }
  }
  return false
}

// var searchMatrix = function (matrix, target) {
// let m = matrix.length, n = matrix[0].length
// let flag = false
// for (let i = 0; i < m; i++) {
//   if (target >= matrix[i][0] && target <= matrix[i][n - 1]) {
//     flag = matrix[i].includes(target)
//     break
//   }
// }
// return flag
// };

