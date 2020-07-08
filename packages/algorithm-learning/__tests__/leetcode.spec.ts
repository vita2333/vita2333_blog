it('07', () => {
  let res = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])
  console.log('res===== ' + res)
})

function buildTree (preorder: number[], inorder: number[]): TreeNode | null {
  const dic = new Map()
  for (let i = 0; i < inorder.length; i++) {
    dic.set(inorder[i], i)
  }
  return recur(0, 0, inorder.length - 1)

  function recur (
    pre_root: number, in_left: number, in_right: number): TreeNode {
    if (in_left > in_right) {return null}
    const root = new TreeNode(preorder[pre_root])
    const i = dic.get(preorder[pre_root])
    root.left = recur(pre_root + 1, in_left, i - 1)
    root.right = recur(pre_root + i - in_left + 1, i + 1, in_right)
    return root
  }
}

class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null

  constructor (val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}

it('06', () => {
  const nodes = new ListNode(1, new ListNode(3, new ListNode(2)))
  let res = reversePrint(nodes)
  expect(res).toEqual([2, 3, 1])
})

/**
 * 递归回溯法
 * T(n)=O(1)
 * S(n)=O(1)
 */
function reversePrint (head: ListNode | null): number[] {
  let tmp = []

  recur(head)
  return tmp

  function recur (head: ListNode | null) {
    if (head === null) return
    recur(head.next)
    tmp.push(head.val)
  }
}

/**
 * Definition for singly-linked list.
 */
class ListNode {
  val: number
  next: ListNode | null

  constructor (val?: number, next?: ListNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
  }
}

it('05', () => {
  const res = replaceSpace2('We are happy.')
  expect(res).toEqual('We%20are%20happy.')
})

/**
 *
 * T(n)=O(1)
 * S(n)=O(1)
 */
function replaceSpace (s: string): string {
  return s.replace(/\ /g, '%20')
}

/**
 *
 * T(n)=O(n)
 * S(n)=O(n)
 */
function replaceSpace2 (s: string): string {
  let res = ''
  for (const v of s) {
    if (v === ' ') {
      res += '%20'
    } else {
      res += v
    }
  }
  return res
}

/**
 * 左下角标志数法
 * T(n)=O(n)
 * S(n)=O(1)
 */
function findNumberIn2DArray (matrix: number[][], target: number): boolean {
  let row = matrix.length - 1
  let col = 0
  while (row >= 0 && col <= matrix[0].length - 1) {
    if (target < matrix[row][col]) {
      row--
    } else if (target > matrix[row][col]) {
      col++
    } else {
      return true
    }
  }
  return false
}

/**
 * 原地置换,利用下标的唯一性
 * T(n)=O(n)
 * S(n)=O(1)
 */
function findRepeatNumber2 (nums: number[]): number {
  let i = 0
  while (i < nums.length) {
    const temp = nums[i]
    if (temp === i) {
      i++
      continue
    }
    if (temp === nums[temp]) {
      return temp
    }
    nums[i] = nums[temp]
    nums[temp] = temp
  }
  return -1
}

/**
 * T(n)=O(n)
 * S(n)=O(n)
 */
function findRepeatNumber (nums: number[]): number {
  let map = new Map()
  for (const n of nums) {
    if (!map.has(n)) {
      map.set(n, true)
    } else {
      return n
    }
  }
  return 0
}
