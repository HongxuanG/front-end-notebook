import LinkedList from "./linkedList";
import { Node } from "./models";
import { defaultEquals } from "../utils/util";
// 单循环链表
export default class CircularLinkedList<T> extends LinkedList<T>{
  constructor(equalFn = defaultEquals){
    super(equalFn)
  }
  push(element: T): void {
    const node = new Node(element)
    if(this.head == null){
      this.head = node
      node.next = this.head
    }else{

      const current = this.getElementAt(this.size() - 1) as Node<T>
      current.next = node
      node.next = this.head
    }
    this.count++
  }
  insert(element: T, index: number): boolean {
    if(index >= 0 && index <= this.count){
      const node = new Node(element)
      let current = this.head
      if(index === 0){
        if(this.head ==null){
          this.head = node
          node.next = this.head
        }else{

          node.next = current
          this.head = node
          current = this.getElementAt(this.size() - 1) as Node<T>
          current.next = this.head
        }
      }else{
        // 不用再加判断尾部了，因为尾部已经和头部连起来了
        const previous = this.getElementAt(index - 1) as Node<T>
        node.next = previous.next
        previous.next = node
      }
      this.count++
      return true
    }
    return false
  }
  removeAt(index: number): T | undefined {
    if(index >=0 && index < this.count){
      let current = this.head as Node<T>
      if(index === 0){
        if(this.size() === 1){
          this.head = undefined
        }else{
          const removed = this.head as Node<T>
          current = this.getElementAt(this.size()) as Node<T>
          current.next = removed?.next
          this.head = removed?.next
          current = removed          
        }
      }else{
        const previous = this.getElementAt(index - 1) as Node<T>
        current = previous.next as Node<T>
        previous.next = current.next
      }

      this.count--
      return current.element
    }
    return undefined
  }

}
