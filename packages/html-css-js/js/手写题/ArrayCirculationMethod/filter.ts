// @ts-ignore
Array.prototype.filter1 = function (callback: Function, thisArg: Record<string, any>) {
  if (this == null) { // this equal undefined or null, it will be trusty
    throw new TypeError('this is null or undefined')
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function')
  }
  const arr = Object(this)
  const len = arr.length >>> 0
  let k = 0
  let resArr = []
  while (k < len) {
    if (k in arr) {
      if (callback.call(thisArg, arr[k], k, arr)) {
        resArr.push(arr[k])
      }
    }
    k++
  }
}
