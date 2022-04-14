export class Node<T> {
  element!: T
  next!: Node<T> | undefined
  constructor(element: T) {
    this.element = element
    this.next = undefined
  }
}
