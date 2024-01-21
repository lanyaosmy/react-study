/**
 * 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

 */
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let max = 0;
  let len = height.length;
  let left = 0,
    right = len - 1;
  while (left < right) {
    let s = Math.min(height[left], height[right]) * (right - left);
    if (max < s) max = s;
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
};
