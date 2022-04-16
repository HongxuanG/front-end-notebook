import { DoublyNode } from './models';
import { defaultEquals } from '../utils/util';
import LinkedList from './linkedList';
export default class DoublyLinkedList<T> extends LinkedList<T>{
  // 头结点
  protected _tail?: DoublyNode<T>
  // 尾结点
  protected _head?: DoublyNode<T> = undefined
  constructor(equalFn: Function = defaultEquals) {
    super(equalFn)
  }
  push(element: T): void {
    const node = new DoublyNode(element)
    if(this._head == null){
      this._head = node
      this._tail = node
    }else{
      (this._tail as DoublyNode<T>).next = node
      node.prev = this._tail
      this._tail = node
    }
    this.count++
  }
  insert(element: T, index: number): boolean {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyNode<T>(element)
      let current = this._head
      if (index === 0) {
        // 第一项
        if (this._head == null) {
          this._head = node
          this._tail = node
        } else {
          node.next = current as DoublyNode<T>
          (current as DoublyNode<T>).prev = node
          this._head = node
        }
      } else if (this.size() === index) {
        // 最后一项
        current = this._tail as DoublyNode<T>
        current.next = node
        node.prev = current
        this._tail = node
      } else {
        // 查找index的上一个索引值index-1
        const previous = this.getElementAt(index - 1) as DoublyNode<T> // 前一个
        current = previous.next as DoublyNode<T>
        node.next = current
        node.prev = previous
        previous.next = node
        current.prev = node
      }
      this.count++
      return true
    }

    return false
  }
  // 做了搜索元素的优化
  // 如果index大于中位数 从尾部开始遍历
  // 如果index小于中位数 从头部开始遍历
  getElementAt(index: number): DoublyNode<T> | undefined {
    const middleIndex = this.size() / 2
    if (middleIndex >= index) {
      let node = this._head
      for (let i = 0; i < index; i++) {
        node = node?.next
      }
      return node
    } else if (middleIndex < index) {
      let node = this._tail
      for (let i = this.count - 1; i > index; i--) {
        node = node?.prev
      }
      return node
    }
    return undefined
  }
  // 给出一个element 删除在双向链表中的element 
  remove(element: T): undefined {
    if (this._head == null) {
      return undefined
    } else {
      let current = this._head as DoublyNode<T>
      let previous = this._head as DoublyNode<T>
      while (!this.equalFn(current.element, element) && current.next != null) {
        previous = current
        current = current.next
      }
      previous.next = current.next as DoublyNode<T>
      (current.next as DoublyNode<T>).prev = previous
      this.count--
    }
  }
  // 给出一个index索引值 找出并删除 返回已删除的element
  removeAt(index: number): T | undefined {
    if (index >= 0 && index < this.count) {
      let current = this._head as DoublyNode<T>
      if (index === 0) {
        this._head = current.next
        if (this.count === 1) {
          this._tail = undefined
        } else {
          (this._head as DoublyNode<T>).prev = undefined
        }
      } else if (index === this.count - 1) {
        current = this._tail as DoublyNode<T>
        this._tail = current.prev as DoublyNode<T>
        (current.prev as DoublyNode<T>).next = undefined
      } else {
        // 中间插入
        current = this.getElementAt(index) as DoublyNode<T>
        const previous = current.prev as DoublyNode<T>
        previous.next = current.next as DoublyNode<T>
        (current.next as DoublyNode<T>).prev = previous
      }
      this.count--
      return current?.element
    }
    return undefined
  }
  get head(){
    return this._head
  }
  get tail(){
    return this._tail
  }
  clear(){
    super.clear()
    this._tail = undefined
  }
}


