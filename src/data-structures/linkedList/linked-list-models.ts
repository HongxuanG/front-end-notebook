export class Node<T> {
  element!: T
  next?: Node<T>
  constructor(element: T, next?: Node<T>) {
    this.element = element
    this.next = next
  }
}
export class DoublyNode<T> extends Node<T>{
  next?: DoublyNode<T>
  prev?: DoublyNode<T>
  constructor(element: T, next?: DoublyNode<T>, prev?: DoublyNode<T>) {
    super(element, next)
    this.next = next
    this.prev = prev
  }
}
