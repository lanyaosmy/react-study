/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
  let m = matrix.length
  let n = matrix[0].length
  let mSet = new Set()
  let nSet = new Set()
  const setCross = (i, j, d) => {
    //    console.log(i, j,mSet,nSet, matrix)
    let i1 = i - 1, i2 = i + 1
    let args = []
    while (d[0] && i1 >= 0) {

      if (mSet.has(i1) || nSet.has(j)) { i1--; continue }
      if (matrix[i1][j] === 0) {
        // trans(i1, j, [1, 1, 0, 1])
        args.push([i1, j, [1, 1, 0, 1]])

      }
      matrix[i1][j] = 0
      i1--
    }
    while (d[2] && i2 < m) {
      if (mSet.has(i2) || nSet.has(j)) { i2++; continue }
      if (matrix[i2][j] === 0) {
        // trans(i2, j, [0, 1, 1, 1])
        args.push([i2, j, [0, 1, 1, 1]])

      }
      matrix[i2][j] = 0
      i2++
    }

    // console.log(i,j,matrix)
    let j1 = j - 1, j2 = j + 1
    while (d[3] && j1 >= 0) {
      if (mSet.has(i) || nSet.has(j1)) { j1--; continue }
      if (matrix[i][j1] === 0) {
        // trans(i, j1, [1, 0, 1, 1])
        args.push([i, j1, [1, 0, 1, 1]])

      }
      matrix[i][j1] = 0
      j1--
    }
    while (d[1] && j2 < n) {
      if (mSet.has(i) || nSet.has(j2)) { j2++; continue }
      if (matrix[i][j2] === 0) {
        // trans(i, j2, [1, 1, 1, 0])
        args.push([i, j2, [1, 1, 1, 0]])

      }
      matrix[i][j2] = 0
      j2++
    }
    mSet.add(i)
    nSet.add(j)
    //  console.log('after',i, j,mSet,nSet, matrix)
    args.forEach((v) => trans(...v))

  }
  const trans = (i, j, d) => {


    setCross(i, j, d)

  }
  for (let i = 0; i < m; i++) {
    if (mSet.has(i)) continue
    for (let j = 0; j < n; j++) {
      if (nSet.has(j)) continue
      if (mSet.has(i)) break
      if (matrix[i][j] === 0) {

        trans(i, j, [1, 1, 1, 1])

      }
    }
  }
};