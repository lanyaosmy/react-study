function ListNode(key, val) {
  this.key = key
  this.val = val
  this.prev = null
  this.next = null
}
function log(head) {
  let h = head
  let arr = []
  while (h.next) {
    arr.push(`${h.key};${h.val}`)
    h = h.next
  }
  console.log(arr.join(','))
}
function removeNode(node) {
  if (node && node.prev) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }
}

function removeTail(tail) {
  let res = tail.prev
  removeNode(res)
  return res
}

function addToHead(node, head) {
  node.prev = head
  node.next = head.next
  head.next.prev = node
  head.next = node

}


/**
* @param {number} capacity
*/
var LRUCache = function (capacity) {
  this.capacity = capacity
  this.size = 0
  this.cache = new Map()
  this.head = new ListNode()
  this.head.next = this.tail = new ListNode()
  this.tail.prev = this.head
};

/** 
* @param {number} key
* @return {number}
*/
LRUCache.prototype.get = function (key) {
  if (this.cache.has(key)) {
    let node = this.cache.get(key)
    removeNode(node)
    addToHead(node, this.head)
    return node.val
  } else {
    return -1
  }
};

/** 
* @param {number} key 
* @param {number} value
* @return {void}
*/
LRUCache.prototype.put = function (key, value) {
  if (this.cache.has(key)) {
    let node = this.cache.get(key)
    node.val = value
    removeNode(node)
    addToHead(node, this.head)

  } else {
    if (this.size >= this.capacity) {
      let res = removeTail(this.tail)
      this.cache.delete(res.key)

    }
    let newNode = new ListNode(key, value)
    this.cache.set(key, newNode)
    addToHead(newNode, this.head)
    this.size += 1

  }

};


// /**
//  * @param {number} capacity
//  */
// var LRUCache = function (capacity) {
// this.capacity = capacity
// this.cache = {}
// this.lru = []
// };

// /** 
//  * @param {number} key
//  * @return {number}
//  */
// LRUCache.prototype.get = function (key) {
//   if (key in this.cache) {
//     let index = this.lru.indexOf(key)
//     this.lru.splice(index, 1)
//     this.lru.push(key)
//     return this.cache[key]

//   } else {
//     return -1
//   }
// };

// /** 
//  * @param {number} key 
//  * @param {number} value
//  * @return {void}
//  */
// LRUCache.prototype.put = function (key, value) {
//   // 已存在
//   if (key in this.cache) {
//     this.cache[key] += value
//     let index = this.lru.indexOf(key)
//     this.lru.splice(index, 1)
//     this.lru.push(key)
//   } else {
//     if (this.lru.length >= this.capacity) {
//       let del = this.lru.shift()
//       delete this.cache[del]
//     }
//     this.cache[key] = value
//     this.lru.push(key)
//   }
// };

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */