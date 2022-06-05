// @ts-ignore
Array.prototype.forEach1 = function (callback: Function, thisArg: Record<string, any>) {
  if (this == null) { // this equal undefined or null, it will be trusty
    throw new TypeError('this is null or undefined')
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function')
  }
  const arr = Object(this)
  const len = arr.length >>> 0
  /**
   * [>>>的意义](https://zhuanlan.zhihu.com/p/100790268)
   * [forEach的官方手写！！](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#polyfill)
   * >>>是无符号右移，>>是有符号移位
   * x >>> 0的意义在于：
   * 确保x为number类型，且值为非负整数，当转换不了number类型的时候，值为0
   * 小小的>>> 0 却隐藏了这么多的错误处理！
   */
  let k = 0
  while (k < len) {
    if (k in arr) {
      callback.call(thisArg, arr[k], k, arr)
    }
    k++
  }
}
export {}
