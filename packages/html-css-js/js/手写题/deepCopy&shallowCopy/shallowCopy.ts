// 哪些方法是浅拷贝呢？
// 1. Object.assign()
// 2. [{name: 'xioaming', {name: 'xiaohong'}, {name: 'xiaohua'}}].slice()
// 3. [{name: 'xioaming', {name: 'xiaohong'}, {name: 'xiaohua'}}].concat([{name: 'jige'},{name: 'ghx'}])
// 4. let arraylike = Array.from([1,2,3,4,5])

// 没处理的赋值，都指向相同的地址sameObj
const obj = { name: 'ghx' }
const sameObj = obj
console.log('简单赋值操作，引用相同地址', sameObj === obj)
// 浅拷贝Object.assign
const shallowCloneObj = Object.assign({}, obj)
console.log('Object.assign，引用不同的地址', shallowCloneObj === obj)

// 拓展运算符
const shallowCloneObj1 = {...obj}
console.log('对象 拓展运算符，引用不同的地址', shallowCloneObj1 === obj)



// 数组 浅拷贝
const loveStack = ['i', 'love', 'you']
// slice 浅拷贝
const shallowCloneStack = loveStack.slice(0)
console.log('Array.property.slice，引用不同地址', loveStack === shallowCloneStack, shallowCloneStack)
// concat 浅拷贝
const shallowCloneStack1 = Array.prototype.concat.call([], loveStack)
console.log('Array.property.concat，引用不同地址', loveStack === shallowCloneStack1, shallowCloneStack1)

// Array.from 浅拷贝
const shallowCloneStack2 = Array.from(loveStack)
console.log('Array.from，引用不同地址', loveStack === shallowCloneStack2, shallowCloneStack2)

// 拓展运算符 浅拷贝
const shallowCloneStack3 = [...loveStack]
console.log('数组 拓展运算符，引用不同地址', loveStack === shallowCloneStack3, shallowCloneStack3)


export {}
