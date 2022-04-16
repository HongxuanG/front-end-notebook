// 链表的结点数据结构
export class Node<T> {
  element!: T
  next?: Node<T>
  constructor(element: T, next?: Node<T>) {
    this.element = element
    this.next = next
  }
}
// 双向链表节点的数据结构
export class DoublyNode<T> extends Node<T>{
  next?: DoublyNode<T>
  prev?: DoublyNode<T>
  constructor(element: T, next?: DoublyNode<T>, prev?: DoublyNode<T>) {
    super(element, next)
    this.next = next
    this.prev = prev
  }
}
