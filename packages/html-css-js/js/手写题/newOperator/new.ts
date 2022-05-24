// @ts-nocheck
type newPerson = {
  name: string,
  age: number
}
function Person(name: string, age: number) {
  this.name = name
  this.age = age
}
Person.prototype.say = function(){
  console.log(`我是${this.name}, 我${this.age}岁了`);
}
let obj: any = new Person('小明', 18)
obj.say()

// ThisType的巧妙使用
type ObjectDescriptor<D,M> = {
  data?: D,
  methods?: M & ThisType<D & M>
}

function makeObject<D, M>(desc: ObjectDescriptor<D,M>): D & M {
  const { data = {}, methods = {} } = desc
  return {
    ...data,
    ...methods,
  } as D & M
}
let person = makeObject({
  data: {
    name: '雄安命',
    age: 18,
  },
  methods: {
    change(name: string, age: number) {
      this.name = name
      this.age = age
    },
  },
})
person.change('小红', 18)
console.log(person.name, person.age)

/**
 * 特点：
 * 1. 如果构造函数返回的不是函数或者对象，则返回new创建的对象，否则直接返回函数或者对象  constructor.apply改变this指向、Object.prototype.toString.call判断类型
 * 2. new 创建出来的对象可以访问构造函数的原型对象上的属性或方法  用Object.create
 * 
 * @param constructor 
 */
// 实现
function newOperator(constructor){
  if(typeof constructor !== 'function'){
    throw new TypeError('constructor不是一个方法')
  }
  // 创建一个原型指向constructor的proptotype的对象，这样这个对象就可以访问Person.prototype.say了
  const newObj = Object.create(constructor.prototype)

  const args = Array.from(arguments).slice(1)

  const result = constructor.apply(newObj,args)

  const originType = Object.prototype.toString.call(result)

  const isObject = originType === `[object Object]`
  const isFunction = typeof result === 'function'
  // 如果返回值是对象或者函数，直接返回，否则返回新创建的对象
  if(isObject || isFunction){
    return result
  }else{
    return newObj
  }
}
const person2 = newOperator(Person, '小v了', 19)
person2.say()
