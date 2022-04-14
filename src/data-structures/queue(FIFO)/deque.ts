// 双端队列
// 可以从队头添加数据删除数据，也可以从队尾添加数据和删除数据
// 是一个特殊的队列
interface QueueItems {
  [Property: number]: any
}
export default class Deque{
  count = 0
  lowestCount = 0
  items: QueueItems = {}
  constructor() { }
  isEmpty() {
    return this.size() === 0
  }
  clear() {
    this.count = 0
    this.items = {}
    this.lowestCount = 0
  }
  size() {
    return this.count - this.lowestCount
  }
  toString() {
    if (this.isEmpty()) return
    let objString = `${this.items[this.lowestCount]}`
    for (let i = this.lowestCount + 1; i < this.count; i++){
      objString += `,${this.items[i]}`
    }
    return objString
  }
  addFront(element: unknown) {
    if (this.isEmpty()) {
      this.addBack(element)
    } else if (this.lowestCount > 0) {
      // 队头有空间，插入队头
      this.items[this.lowestCount--] = element
    } else {
      // 所有元素向后移一位，腾出空间，让element插入队头
      for (let i = this.count; i > 0; i--){
        this.items[i] = this.items[i - 1]
      }
      this.items[0] = element
      this.count++
      this.lowestCount = 0
    }
  }
  addBack(element: unknown) {
    this.items[this.count] = element
    this.count++
  }
  removeFront() {
    if(this.isEmpty()) return
    let result = this.items[this.lowestCount]
    delete this.items[this.lowestCount]
    this.lowestCount++
    return result
  }
  removeBack() {
    if(this.isEmpty()) return
    let result = this.items[this.count]
    delete this.items[this.count]
    this.count--
    return result
  }
  peekFront() {
    if (this.isEmpty()) return
    return this.items[this.count]
  }
  peekBack() {
    if (this.isEmpty()) return
    return this.items[this.lowestCount]
  }
}
// usage
let deque = new Deque()
console.log(deque.isEmpty())
deque.addBack('john')
deque.addBack('jack')
console.log(deque.toString())
deque.removeBack()
console.log(deque.toString())
