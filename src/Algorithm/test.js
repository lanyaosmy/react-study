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


// 62. 不同路径
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
  // let path = new Array(m).fill(new Array(n).fill(0))
  // path[0][0] = 1
  // for (let i = 0; i < m; i++) {
  //   for (let j = (i===0?1:0); j < n; j++) {
  //     let top = i > 0 ? path[i - 1][j] : 0
  //     let left = j > 0 ? path[i][j - 1] : 0
  //     path[i][j] = top + left
  //   }
  // }
  // return path[m - 1][n - 1]

  // 优化空间O(n)
  let path = new Array(n).fill(1)
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      path[j] += path[j - 1]
    }
  }
  return path[n - 1]
};

// 63.不同路径2
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function (obstacleGrid) {
  let m = obstacleGrid.length, n = obstacleGrid[0].length
  let path = new Array(m).fill(new Array(n).fill(0))
  path[0][0] = 1
  for (let i = 0; i < m; i++) {
    for (let j = (i === 0 ? 1 : 0); j < n; j++) {
      let top = i > 0 && !obstacleGrid[i - 1][j] ? path[i - 1][j] : 0
      let left = j > 0 && !obstacleGrid[i][j - 1] ? path[i][j - 1] : 0
      path[i][j] = top + left
    }
  }
  return path[m - 1][n - 1]
};

// 64.最小路径和
/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function (grid) {
  let m = grid.length, n = grid[0].length
  let path = new Array(m).fill([])
  path[0][0] = grid[0][0]
  for (let i = 0; i < m; i++) {
    for (let j = (i === 0 ? 1 : 0); j < n; j++) {
      let top = i > 0 ? path[i - 1][j] : 1000
      let left = j > 0 ? path[i][j - 1] : 1000
      path[i][j] = Math.min(top, left) + grid[i][j]
    }
    // console.log(path[i]);
  }
  // console.log(path[0]);
  return path[m - 1][n - 1]
};
minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]])


// 66
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  let i = digits.length - 1
  let plus = 1
  while (plus > 0 && i >= 0) {
    let num = digits[i] + plus
    plus = num > 9 ? 1 : 0
    digits[i] = num % 10
  }
  if (plus) {
    digits.unshift(1)
  }
  return digits
};

// 67

/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
  let p1 = a.length - 1, p2 = b.length - 1
  let plus = 0
  let result = ''
  while (p1 >= 0 || p2 >= 0) {
    let aNum = p1 >= 0 ? a.charAt(p1) : 0
    let bNum = p2 >= 0 ? b.charAt(p2) : 0
    let sum = Number(aNum) + Number(bNum) + plus
    if (sum > 1) {
      plus = 1
    }
    console.log(sum, plus)
    result = `${result}${sum % 2}`
    p1--
    p2--
  }
  if (plus) {
    result = `1${result}`
  }

  return result
};

// 72. 编辑距离
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {

};


// 79. 单词搜索
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
  let m = board.length
  let n = board[0].length
  var dfs = (ind, i, j) => {
    if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] !== word.charAt(ind)) return false
    if (ind === word.length - 1) {
      return true
    }
    board[i][j] = ''
    let next = dfs(ind + 1, i - 1, j) || dfs(ind + 1, i + 1, j) || dfs(ind + 1, i, j - 1) || dfs(ind + 1, i, j + 1)
    board[i][j] = word.charAt(ind)
    return next
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(0, i, j)) return true
    }
  }
  return false
};

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let i = 1
  let count = 1
  while (i < nums.length) {
    if (nums[i] === nums[i - 1]) {
      if (count === 2) {
        nums.splice(i, 1)
      } else {
        count += 1;
        i++
      }
    } else {
      count = 1
      i++
    }
  }
  return i
};


// 438. 找到字符串中所有字母异位词
var findAnagrams = function (s, p) {
  let l = 0
  let r = 0
  let len = s.length
  let set = new Set()
  let result = []

  while (r < len) {
    let rc = s.charAt(r)
    if (set.length === p.length) {
      result.push(l)
      set.clear()
    }
    if (p.indexOf(rc) > -1) {
      if (!set.has(rc)) {
        set.add(rc)
      } else {
        l++
      }
      r++
    } else {
      r++
      l = r
    }
  }
  return result
};