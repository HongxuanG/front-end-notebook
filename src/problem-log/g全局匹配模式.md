# g模式全局匹配
今天遇到了一个很神奇的事
正则表达式全局匹配模式 `g`
test两次 输出的结果不一样

我用正则校验表单的时候，想打印test的结果是`true`还是`false`，结果第一个test是`true`，第二个test是`false`
```javascript
function strange() {
  let reg = /^[0-9A-F]{12}$/gi
  console.log('第一遍test', reg.test('818FDAE4C284')) // output: true
  console.log('第二遍test', reg.test('818FDAE4C284')) // output: false
  console.log('isNaN的结果:', isNaN(1)) // output: false
  if (!reg.test('818FDAE4C284') || isNaN(1)) {
    return '校验不通过' // if 条件语句明明是 false, 但是却进到这里？？？
  } else {
    return '校验通过'
  }
}
console.log(strange()) // output: 校验不通过
```
MDN上已经有了解释：
[关于设置了全局标志的正则使用test()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#%E5%BD%93%E8%AE%BE%E7%BD%AE%E5%85%A8%E5%B1%80%E6%A0%87%E5%BF%97%E7%9A%84%E6%AD%A3%E5%88%99%E4%BD%BF%E7%94%A8test)

从已匹配到的索引值开始继续进行匹配

换句话说就是，第一遍`test()`的时候`RegExp`的`lastIndex`已经到尾部字符串的尾部，输出`true`，在进行第二遍`test()`的时候，test会从`lastIndex`再次开始，因此第二遍`test()`的结果是`false`

