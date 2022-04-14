import { defaultEquals } from '../utils/util';
import { Node } from './linked-list-models';
// 链表
// 有指针，指向头节点 节点有数据域和指针域
// 可以随意插入任意一个地方
export default class LinkedList<T>{
  count: number = 0
  head!: Node<T>
  equalFn: Function = defaultEquals
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
      while (current != null) {
        current = current.next as Node<T>
      }
      // 最后面的node的next指向新节点node
      (current as Node<T>).next = node
    }
    // 表长加一
    this.count++
  }
  // 从链表的特定位置插入一个新元素
  insert(element: T, position: number) {

  }
  // 从特定位置获取元素
  getElementAt(index: number) {
    if (index >= 0 && index <= this.count) {
      let node = this.head
      for (let i = 0; i < index && node != null; i++){
        node = node.next as Node<T>
      }
      return node.element
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

  }
  // 删除特定元素
  removeAt(index: number) {
    // 边界值处理
    if (index >= 0 && index < this.count) {
      let current = this.head
      if (index === 0) {
        // 移除第一个元素 为什么要分开处理index === 0的情况呢，因为index = 0没有上一个元素
        this.head = current.next as Node<T>
      } else {
        let previous!: Node<T>
        // 遍历寻找index位置的元素
        for (let i = 0; i < index; i++){
          previous = current
          current = current.next as Node<T>
        }
        (previous.next as Node<T>) = current.next as Node<T>
      }
      this.count--
      return current.element
    }
    return undefined
  }
  // 链表是否为空
  isEmpty() {
    return this.head == null
  }
  // 返回链表的长度
  size() {
    return this.count
  }
  // 序列化
  toString() {

  }
}
