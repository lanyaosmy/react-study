/*
 * @lc app=leetcode.cn id=61 lang=javascript
 *
 * [61] 旋转链表
 *
 * https://leetcode.cn/problems/rotate-list/description/
 *
 * algorithms
 * Medium (41.33%)
 * Likes:    1021
 * Dislikes: 0
 * Total Accepted:    352.6K
 * Total Submissions: 852.9K
 * Testcase Example:  '[1,2,3,4,5]\n2'
 *
 * 给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：head = [1,2,3,4,5], k = 2
 * 输出：[4,5,1,2,3]
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：head = [0,1,2], k = 4
 * 输出：[2,0,1]
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 链表中节点的数目在范围 [0, 500] 内
 * -100 <= Node.val <= 100
 * 0 <= k <= 2 * 10^9
 * 
 * 
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
  if (!head || !k) return head
  let p = h = head
  let num = 1
  while (p.next) {
    p = p.next
    num += 1
  }
  let step = num - k % num
  let p1 = head, pre = head
  if (step < num) {
    while (step > 0) {
      pre = p1
      p1 = p1.next
      step -= 1
    }
    pre.next = null
    p.next = h
  }
  return p1
};
// @lc code=end

