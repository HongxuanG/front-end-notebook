type StackItems = {
  [Property: number]: any
}

// 基于javascript的对象的Stack类
export default class Stack {
  private count: number = 0
  private items: StackItems = {}
  constructor() {

  }
  push(element: any) {
    this.items[this.count] = element
    this.count++
  }
  // {
  //  0: item1,
  //  1: item2
  // }
  pop() {
    if (this.isEmpty()) {
      return undefined
    }
    this.count-- // 长度为2  要删除栈顶元素 count自减1 才能拿到栈顶元素
    const result = this.items[this.count]
    delete this.items[this.count]
    return result
  }
  isEmpty() {
    return this.count === 0
  }
  clear() {
    this.items = {}
    this.count = 0
  }
  peek() {
    if (this.isEmpty()) return undefined
    return this.items[this.count - 1]
  }
  size() {
    return this.count
  }
  toString() {
    if (this.isEmpty()) {
      return ''
    }
    let objString = `${this.items[0]}`
    for (let i = 1; i <= this.count - 1; i++) {
      objString = `${objString},${this.items[i]}`
    }
    return objString
  }
}
let stack = new Stack()
console.log(Object.getOwnPropertyNames(stack))
console.log(Object.keys(stack))
