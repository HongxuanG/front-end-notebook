// 1983年 达夫偶然发现的能有 优化 循环的思想
// ---------------展开循环-----------------

// 什么叫展开循环?
// 正常循环我们都是 for循环 每一轮循环都执行一次循环体，中间还要判断终止条件

// 然而有了展开循环这样的思想我们可以不必在每次循环的时候都判断终止条件，而且还能让循环提升40%的性能

// 创建一个长度足够长的数组
const values = new Array(10000000)
values.fill(1)
let iterations = Math.ceil(values.length / 8) // 需要迭代多少次
let startAt = values.length % 8 // 从索引是多少开始迭代
let i = 0

const loopBody = (arrayElement: number, index: number) => {
  
}


console.time('test1')
for (let i = 0; i < values.length; i++) {
  loopBody(values[i++], i)
}
console.timeEnd('test1')

// console.time('test2')
// do {
//   switch (startAt) {
//     case 0:
//       loopBody(values[i++], i)
//     case 7:
//       loopBody(values[i++], i)
//     case 6:
//       loopBody(values[i++], i)
//     case 5:
//       loopBody(values[i++], i)
//     case 4:
//       loopBody(values[i++], i)
//     case 3:
//       loopBody(values[i++], i)
//     case 2:
//       loopBody(values[i++], i)
//     case 1:
//       loopBody(values[i++], i)
//   }
//   startAt = 0 // 开始执行 8 次 callback
// } while (--iterations > 0)
// console.timeEnd('test2')


function Duff(arr: number[], callback: Function) {
  // 一次循环体中执行 8 次，降低循环次数
  const step = 8;
  // 降低 8 倍后，还需要执行的次数
  let count = Math.floor(arr.length / step);
  // 获取余数
  let startAt = count % step;

  let i = 0;

  while (startAt > 0) {
    callback(i++);

    startAt--;
  }

  while (count > 0) {
    callback(arr[i++], i)
    callback(arr[i++], i);
    callback(arr[i++], i);
    callback(arr[i++], i);
    callback(arr[i++], i);
    callback(arr[i++], i);
    callback(arr[i++], i);
    callback(arr[i++], i);

    count--;
  }
}
console.time('test2')
Duff(values, loopBody)
console.timeEnd('test2')
