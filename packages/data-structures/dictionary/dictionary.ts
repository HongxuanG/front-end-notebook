import { defaultToString } from '../utils/util'
export default class Dictionary<K, V> {
  toStrFn: Function = defaultToString
  table: Record<string, ValuePair<K, V>> = {}
  constructor(toStrFn: Function = defaultToString) {
    this.toStrFn = toStrFn // 当键不是string类型的时候，需要用特定的方法将键转成string类型
    this.table = {} // 主要的存储格式  键值对  键是string类型  值可以是任意类型
  }
  set(key: K, value: V) {
    if (key != null && value != null) {
      const tableKey = this.toStrFn(key)
      this.table[tableKey] = new ValuePair(key, value)
      return true
    }
    return false
  }
  remove(key: K) {
    if (this.hasKey(key)) {
      delete this.table[this.toStrFn(key)]
      return true
    }
    return false
  }
  hasKey(key: K) {
    return this.table[this.toStrFn(key)] != null
  }
  get(key: K) {
    const valuePair = this.table[this.toStrFn(key)]
    return valuePair == null ? undefined : valuePair.value
  }
  clear() {
    this.table = {}
  }
  size() {
    return Object.keys(this.table).length
  }
  values() {
    return this.keyValues().map((valuePair) => valuePair.value)
  }
  isEmpty() {
    return this.size() === 0
  }
  keys() {
    return this.keyValues().map((valuePair) => valuePair.key)
  }
  keyValues() {
    return Object.values(this.table)
  }
  forEach(callbackFn: (key: K, value: V) => boolean) {
    const valuePairs = this.keyValues()
    for (let i = 0; i < valuePairs.length; i++) {
      const result = callbackFn(valuePairs[i].key, valuePairs[i].value)
      if (result === false) {
        break
      }
    }
  }
  toString(){
    if(this.isEmpty())return ''
    const valuePairs = this.keyValues()
    let objString = `${valuePairs[0].toString()}`
    for(let i = 1;i<valuePairs.length;i++){
      objString += `,${objString[i].toString()}`
    }
    return objString
  }
}
class ValuePair<K, V> {
  // 传入原始的键值对
  constructor(public key: K, public value: V) {}
  toString() {
    // 为了方便输出结果，用toString
    return `[${this.key}: ${this.value}]`
  }
}
