/**
 * 快速排序
 * @param {*} arr
 * @param {*} left
 * @param {*} right
 * @returns
 */
function quickSort(arr, left, right) {
  let index = 0;
  if (left < right) {
    index = partition(arr, left, right);
    quickSort(arr, left, index - 1);
    quickSort(arr, index + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  let pivot = arr[left];
  console.log('pivot', pivot);
  let l = left;
  let r = right;
  while (l < r) {
    // 从右向左找出小于pivot的值
    while (l < r && arr[r] > pivot) r--;
    // 与pivot交换
    swap(arr, l, r);
    // 从左向右找出大于pivot的值
    while (l < r && arr[l] < pivot) l++;
    // 与pivot交换
    swap(arr, l, r);
  }
  arr[l] = pivot;
  return l;
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
let arr = [30, 40, 60, 10, 20, 50];

console.log(quickSort(arr, 0, arr.length - 1));
