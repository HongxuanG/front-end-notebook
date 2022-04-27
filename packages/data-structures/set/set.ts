// ?集合  集合是由一组无序的唯一的项组成的
export default class Set<T> {
  items: Record<string, T>
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

  // 并集
  union(otherSet: Set<T>) {
    const unionSet = new Set()
    this.values().forEach((value, index) => unionSet.add(index + '', value))
    otherSet.values().forEach((value) => unionSet.add(unionSet.size() + 1 + '', value))
    return unionSet
  }

  // 交集
  intersection(otherSet: Set<T>) {
    const intersectionSet = new Set()
    const values = this.values()
    // for(let i = 0;i<values.length;i++){
    //   if(otherSet.has(i+'')){
    //     intersectionSet.add(i+'', values[i])
    //   }
    // }
    // return intersectionSet
    // 改进方法，上述的方法存在大量的性能开销，最坏的可能是循环长度最长的那个Set找出相同的元素
    // 我们可以只循环长度最短的那个Set同样能找出相同的元素
    const otherValues = otherSet.values()
    let biggerSet = values
    let smallerSet = otherValues
    if (otherValues.length - values.length > 0) {
      biggerSet = otherValues
      smallerSet = values
    }
    for (let i = 0; i < smallerSet.length; i++) {
      if (biggerSet.includes(smallerSet[i])) {
        intersectionSet.add(i + '', smallerSet[i])
      }
    }
    return intersectionSet
  }

  // 差集
  different(otherSet: Set<T>) {
    const differentSet = new Set()
    this.values().forEach((value, index) => {
      if (!otherSet.has(index + '')) {
        differentSet.add(index + '', value)
      }
    })
  }

  // 子集
  inSubsetOf(otherSet: Set<T>): boolean{
    // 如果当前的集合比otherSet的集合要大，那就不是子集了
    if(this.size() > otherSet.size()){
      return false
    }
    let isSubset = true
    this.values().every(value => {
      if (!otherSet.values().includes(value)) {
        isSubset = false
      }
      return true
    })
    return isSubset
  }
}
