import { DoublyNode, Node } from './linked-list-models';
import { defaultEquals } from '../utils/util';
import LinkedList from './linkedList';
export default class DoublyLinkedList<T> extends LinkedList<T>{
  // 头结点
  protected tail!: DoublyNode<T>
  // 尾结点
  protected head?: DoublyNode<T> = undefined
  constructor(equalFn: Function = defaultEquals) {
    super(equalFn)
  }
  insert(element: T, index: number): boolean {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyNode<T>(element)
      let current = this.head
      if (index === 0) {
        // 第一项
        if (this.head == null) {
          this.head = node
          this.tail = node
        } else {
          node.next = current as DoublyNode<T>
          (current as DoublyNode<T>).prev = node
          this.head = node
        }
      } else if (this.size() === index) {
        // 最后一项
        current = this.tail
        current.next = node
        node.prev = current
        this.tail = node
      } else {
        // 查找index的上一个索引值index-1
        current = this.getElementAt(index - 1)
        
      }
      this.count++
      return true
    }
    
    return false
  }
  // 二分查找法
  // getElementAt(index: number): DoublyNode<T> {
  //   const middleIndex = this.size() / 2
  //   if (middleIndex > index) {
  //     for (let i = 0; i < middleIndex; i++){
  //       if()
  //     }
  //   } else if(middleIndex < index) {
      
  //   } else {
      
  //   }
  // }
}
