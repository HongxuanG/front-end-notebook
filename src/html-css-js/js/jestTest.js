function strange() {
  let reg = /[0-9A-F]{12}/gi
  console.log('校验:', !reg.test('818FDAE4C284') || isNaN(1)) // output: false
  console.log('reg实例', reg)
  console.log('正则匹配的结果:', reg.test('818FDAE4C284')) // output: false
  console.log('isNaN的结果:', isNaN(1)) // output: false
  if (!reg.test('818FDAE4C284') || isNaN(1)) {
    return '校验不通过' // if 条件语句明明是 false, 但是却进到这里？？？
  } else {
    return '校验通过'
  }
}
console.log(strange())
module.exports = strange
