// ?集合  集合是由一组无序的唯一的项组成的
export default class Set<T> {
  items: {
    [property: string]: T
  }
  constructor() {
    // 用对象存储方便一点，用数组也可以
    this.items = {}
  }
  add(key: string, element: T) {
    if (!this.has(key)) {
      this.items[key] = element
      return true
    }
    return false
  }
  delete(key: string) {
    if (this.has(key)) {
      delete this.items[key]
      return true
    }
    return false
  }
  /**
   * 判断集合里面是否有element 
   * @param element unknown
   * @returns boolean
   */
  has(key: string) {
    return Object.prototype.hasOwnProperty.call(this.items, key)
  }
  // 清空集合里面的所有元素
  clear() {
    this.items = {}
  }
  // 集合的长度
  size() {
    return Object.keys(this.items).length
  }
  // 返回包含集合里面所有值的数组
  values(): T[] {
    return Object.values(this.items)
  }
  isEmpty() {
    return this.size() === 0
  }
  // 序列化
  toString() {
    if (this.isEmpty()) {
      return ''
    }
    const valueArray = this.values()
    let objString = `${valueArray[0]}`
    for (let i = 1; i < valueArray.length; i++) {
      objString += `,${valueArray[i]}`
    }
    return objString
  }
}
