import LinkedList from "./linkedList";

// 使用链表实现栈
export default class StackLinkedList<T> {

  items: LinkedList<T>
  constructor() {
    this.items = new LinkedList()
  }
  push(element: T) {
    this.items.push(element)
  }
  pop() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items.removeAt(this.size() - 1)
  }
  // 获取栈顶的元素
  peek() {
    return this.items.getElementAt(this.size() - 1)?.element
  }
  isEmpty() {
    return this.items.isEmpty()
  }
  size() {
    return this.items.size()
  }
  clear() {
    this.items.clear()
  }
}
