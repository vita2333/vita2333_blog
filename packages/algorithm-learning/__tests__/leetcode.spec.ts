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
