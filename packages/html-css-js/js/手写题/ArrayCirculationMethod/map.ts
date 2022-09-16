// @ts-ignore
Array.prototype.map1 = function (callback: Function, thisArg: Record<string, any>) {
  if (this == null) {
    throw new TypeError('this is null or undefined')
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function')
  }
  let arr = Object(this)
  let len = arr.length >>> 0
  let k = 0
  let resArr = []
  while (k < len) {
    if (k in arr) {
      resArr[k] = callback.call(thisArg, arr[k], k, arr)
    }
    k++
    return resArr
  }
}
export {}
