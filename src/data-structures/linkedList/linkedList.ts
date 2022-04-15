import { defaultEquals } from '../utils/util';
import { Node } from './linked-list-models';
// 链表
// 有指针，指向头节点 节点有数据域和指针域
// 可以随意插入任意一个地方
export default class LinkedList<T>{
  protected count = 0
  protected head?: Node<T>
  protected equalFn: Function = defaultEquals
  constructor(equalFn: Function = defaultEquals) {
    this.equalFn = equalFn
  }
  // 链表表尾添加一个新元素
  push(element: T) {
    const node = new Node(element)
    let current: Node<T>
    if (this.head == null) {
      this.head = node
    } else {
      current = this.head
      // 循环查找表尾
      while (current.next != null) {
        current = current.next as Node<T>
      }
      // 最后面的node的next指向新节点node
      (current as Node<T>).next = node
    }
    // 表长加一
    this.count++
  }
  // 从链表的特定位置插入一个新元素 返回布尔值 true | false
  insert(element: T, index: number) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element)
      if (index === 0) {
        const current = this.head
        node.next = current
        this.head = node
      } else {
        const previous = this.getElementAt(index - 1)
        const current = (previous as Node<T>).next
        node.next = current as Node<T>
        (previous as Node<T>).next = node
      }
      this.count++
      return true
    }
    return false
  }
  // 从特定位置获取元素 
  // TODO: 优化：二分查找法
  getElementAt(index: number) {
    if (index >= 0 && index <= this.count) {
      let node = this.head
      for (let i = 0; i < index && node != null; i++) {
        node = node.next
      }
      return node
    }
    return undefined
  }
  // 从链表中移除一个元素
  remove(element: T) {

    if (this.head == null) {
      return undefined
    } else {
      let current = this.head
      let previous = this.head
      while (current.element !== element) {
        previous = current
        current = current.next as Node<T>
      }
      previous.next = current.next
      this.count--
    }
  }
  // 返回该元素的索引，没有的返回-1
  indexOf(element: T) {
    let current = this.head

    for (let i = 0; i < this.count && current != null; i++) {
      if (this.equalFn(element, current.element)) {
        return i
      }
      current = current.next as Node<T>
    }
    return -1
  }
  // 删除特定元素
  removeAt(index: number) {
    // 边界值处理
    if (index >= 0 && index <= this.count) {
      let current = this.head
      if (index === 0) {
        // 移除第一个元素 为什么要分开处理index === 0的情况呢，因为index = 0没有上一个元素
        this.head = (current as Node<T>).next
      } else {
        let previous!: Node<T>
        // 遍历寻找index位置的元素
        for (let i = 0; i < index; i++) {
          previous = current as Node<T>
          current = (current as Node<T>).next
        }
        previous.next = (current as Node<T>).next
      }
      this.count--
      return (current as Node<T>).element
    }
    return undefined
  }
  // 链表是否为空
  isEmpty() {
    return this.size() === 0
  }
  // 返回链表的长度
  size() {
    return this.count
  }
  // 序列化
  toString() {
    if (this.isEmpty()) return ''
    let objString = `${this.head?.element}`
    let current = this.head?.next
    for (let i = 1; i < this.count && current != null; i++) {
      objString += `,${current.element}`
      current = current.next
    }
    return objString
  }
}
let linkedList = new LinkedList()
linkedList.push(1)
linkedList.push(2)
linkedList.push(3)
console.log(linkedList.toString())
