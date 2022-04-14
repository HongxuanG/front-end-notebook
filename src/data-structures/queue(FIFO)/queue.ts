interface QueueItems {
  [Property: number]: any
}
export default class Queue{
  private count: number = 0;
  private lowestCount = 0;
  private items: QueueItems = {}
  constructor() {
    
  }
  // 入队
  enqueue(element: unknown) {
    this.items[this.count] = element
    this.count++
  }
  // 出队
  dequeue() {
    if (this.isEmpty()) return
    const result = this.items[this.lowestCount]
    delete this.items[this.lowestCount]
    this.lowestCount++
    return result
  }
  peek() {
    if(this.isEmpty()) return
    return this.items[this.lowestCount]
  }
  isEmpty() {
    return this.size() === 0
  }
  size() {
    return this.count - this.lowestCount // 为什么要想减？count始终指向的是队尾，而lowestCount始终指向的是队头，队尾和队头相减就是长度
  }
  clear() {
    this.items = {}
    this.count = 0
    this.lowestCount = 0
  }
  toString() {
    if (this.isEmpty()) return ''
    let objString = `${this.items[this.lowestCount]}`
    for (let i = this.lowestCount + 1; i < this.count; i++){
      objString += `,${this.items[i]}`
    }
    return objString
  }
}
let queue = new Queue()
console.log(queue.isEmpty());
queue.enqueue(0)
queue.enqueue(1)
console.log(queue.toString())
console.log(queue.size())
