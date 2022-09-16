let originArr = [1, 2, 3, 4, 1, 2, 5]
// 1. set
let newArr = [...new Set(originArr)]

// 2. filter + includes
let newArr1: number[] = []
newArr1 = originArr.filter((v) => (newArr1.includes(v) ? '' : newArr1.push(v)))

let newArr2: number[] = []
// 3. for循环 + indexOf
for (let i = 0; i < originArr.length; i++) {
  if (newArr2.indexOf(originArr[i]) === -1) {
    newArr2.push(originArr[i])
  }
}
console.log('newArr2==>', newArr2)

let newArr3: number[] = []
// 双重for循环
for (let i = 0; i < originArr.length; i++) {
  let flag = true
  for (let j = 0; j < newArr3.length; j++) {
    if (originArr[i] === newArr3[j]) {
      flag = false
    }
  }
  if (flag) {
    newArr3.push(originArr[i])
  }
}
console.log('newArr3===>', newArr3)
// for循环 + includes
let newArr4: number[] = []
for (let i = 0; i < originArr.length; i++) {
  if (!newArr4.includes(originArr[i])) {
    newArr4.push(originArr[i])
  }
}
console.log('newArr4====>', newArr4)

// 利用object对象的属性唯一性
let newArr5: number[] = []
let indexObj: Record<number, any> = {}
for (let i = 0; i < originArr.length; i++) {
  if (originArr[i] in indexObj) {
    indexObj[originArr[i]]++
  } else {
    indexObj[originArr[i]] = 1
    newArr5.push(originArr[i])
  }
}
console.log('newArr5==>', newArr5, indexObj)
