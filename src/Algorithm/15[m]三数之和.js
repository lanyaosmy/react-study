/**
 * 
 * 
 * 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，
 * 使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

示例 1：

输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
示例 2：

输入：nums = []
输出：[]
示例 3：

输入：nums = [0]
输出：[]

1. 特判，对于数组长度 n，如果数组为 null 或者数组长度小于 3，返回 []。
2. 对数组进行排序。
3. 遍历排序后数组：
  若 nums[i]>0：因为已经排序好，所以后面不可能有三个数加和等于 0，直接返回结果。
  对于重复元素：跳过，避免出现重复解
  令左指针 L=i+1，右指针 R=n-1，当 L<R 时，执行循环：
    当 nums[i]+nums[L]+nums[R]==0，执行循环，判断左界和右界是否和下一位置重复，去除重复解。并同时将 L,R 移到下一位置，寻找新的解
    若和大于 0，说明 nums[R] 太大，R 左移
    若和小于 0，说明 nums[L] 太小，L 右移

 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  if (!nums || nums.length < 3) {
    return [];
  }
  let result = [];
  let arr = nums.sort((a, b) => a - b);
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i] > 0) return result;
    if (i > 0 && arr[i] === arr[i - 1]) continue;
    let l = i + 1,
      r = len - 1;
    while (l < r) {
      let sum = arr[i] + arr[l] + arr[r];
      if (sum === 0) {
        result.push([arr[i], arr[l], arr[r]]);
        while (l < r && arr[l] === arr[l + 1]) l++;
        while (l < r && arr[r] === arr[r - 1]) r--;
        l++;
        r--;
      } else if (sum > 0) {
        r--;
      } else {
        l++;
      }
    }
  }
  return result;
};
console.log(threeSum([-1, 0, 1, 2, -1, -4]));

/**
 * 16. 最接近的三数之和
 * 给你一个长度为 n 的整数数组 nums 和 一个目标值 target。
 * 请你从 nums 中选出三个整数，使它们的和与 target 最接近。
 * 返回这三个数的和。
 */

/**
 *
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
  let arr = nums.sort((a, b) => a - b);
  console.log('arr', arr);
  let len = arr.length;
  let min = Infinity;
  for (let i = 0; i < len; i++) {
    let l = i + 1,
      r = len - 1;

    while (l < r) {
      let sum = arr[i] + arr[l] + arr[r];
      console.log('arr[i] + arr[l] + arr[r]', arr[i], arr[l], arr[r]);
      let abs = target - sum;
      // [-4, -1, 1, 2]
      console.log('Math.abs(abs)', sum, Math.abs(abs), Math.abs(target - min));
      if (Math.abs(abs) < Math.abs(target - min)) {
        min = sum;
        console.log('min', min);
      }
      if (abs === 0) {
        return sum;
      } else if (abs > 0) {
        l++;
      } else {
        r--;
      }
    }
  }
  return min;
};
console.log(threeSumClosest([4, 0, 5, -5, 3, 3, 0, -4, -5], -2));
