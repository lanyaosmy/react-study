/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  // (l1 = [2, 4, 3]), (l2 = [5, 6, 4]);
  // 342 + 465 = 807
  let plus = 0;
  let head = new ListNode();
  let tail = head;
  while (l1 || l2) {
    let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + plus;
    plus = sum >= 10 ? 1 : 0;
    tail.next = new ListNode(sum % 10);
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
    tail = tail.next;
  }
  if (plus) {
    tail.next = new ListNode(plus);
  }
  return head.next;
};
// @lc code=end
