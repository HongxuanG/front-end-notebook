
// JSON.stringify()和JSON.parse()  不过对function、symbol、undefined类型不起作用
const obj = {
  name: 'ghx',
  age: 18,
  identify: Symbol('440682.....'),
  like: {
    game: 'the last of us',
    book: 'js高级程序设计',
    girl: undefined,
  },
  a: NaN,
  b: Infinity,
  c: -Infinity,
  say() {
    console.log('hahaha')
  },
}
const newObj = JSON.parse(JSON.stringify(obj))
/** 输出：
 * {
    name: 'ghx',
    age: 18,
    like: { game: 'the last of us', book: 'js高级程序设计' }
  }

  undefined symbol function都没了，NaN Infinity  -Infinity都会被序列化为null
 */
console.log(newObj)

// 循环引用
// const circularObj = {a: 1}
// // @ts-ignore
// circularObj.circularObj = circularObj

// const newObj1 = JSON.parse(JSON.stringify(circularObj))
// console.log(newObj1)  // 报错  不能序列化循环引用的对象

// 手写深拷贝

// 前置知识：
  // 原始类型：number、string、boolean、undefined、symbol、null、bigint
  // 引用类型：array、function、object
// 1. for in 不能遍历symbol  我们使用Reflect.ownKeys()
// 2. 
/**
 * typeof 11 === 'number'
 * typeof 'string' === 'string'
 * typeof false === 'boolean'
 * typeof undefined === 'undefined'
 * typeof Symbol('ghx') === 'symbol'
 * typeof 13n === 'bigint'
 * typeof function(){} === 'function'
 * 
 * undefined == null
 * undefined !== null
 * 
 * typeof null === 'object'
 * typeof [111] === 'object'
 * typeof {} === 'object'
 * typeof new Date() === 'object'
 * typeof new RegExp() === 'object'
 */
const rawObj1 = {
  name: 'ghx',
  age: 18,
  time: new Date(),
  reg: /aaa/,
  [Symbol('ghx')]: 'ghx',
  like: {
    game: 'the last of us',
    book: 'js高级程序设计',
    girl: undefined,
  },
}
// 循环引用案例
const rawObj = {
  a: 1
}
// @ts-ignore
rawObj.rawObj = rawObj
// 手写深拷贝
function deepClone(obj: any, hash = new WeakMap()) {
  // 处理null
  if(obj === null) return null
  // 处理Date
  if(obj instanceof Date) return new Date(obj)
  // 处理正则
  if(obj instanceof RegExp) return new RegExp(obj)
  // 处理基本数据类型
  if(typeof obj !== 'object') return obj
  // 解决循环引用问题
  if(hash.has(obj)) return hash.get(obj)
  // 处理Array和Object
  const cloneResult = new obj.constructor()
  // 缓存到hash里面
  hash.set(obj, cloneResult)
  // 处理Symbol无法用for in循环的情况
  Reflect.ownKeys(obj).forEach(key => {
    cloneResult[key] = deepClone(obj[key], hash)
  })
  return cloneResult
}
const result = deepClone(rawObj)
console.log(result)


export {}
