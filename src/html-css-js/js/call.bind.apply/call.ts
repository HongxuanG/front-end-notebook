// 手写call
namespace CodingCallFunctionByMyself {
  let otherCases = {
    name: 'this is otherCases'
  }
  let testCases = {
    name: 'this is testCases',
    do() {
      console.log(this)
      console.log("name value will be", this.name)
    }
  }
  var global = {
    name: 'this is globalCases'
  }
  // testCases.do.call(otherCases)
  // @ts-ignore
  Function.prototype.ghxcall = function (context, ...args) {
    let contextDescriptor = context || global || window
    // 唯一值 key 作为待挂载函数的属性名
    args = args ?? []
    const key = Symbol()
    console.log('this point to', this)
    // 把函数挂载到 执行的context上下文 上面去，让他可以访问
    contextDescriptor[key] = this
    const result = contextDescriptor[key](...args)
    // 执行完之后删除唯一值
    delete contextDescriptor[key]
    return result
  }
  // @ts-ignore
  testCases.do.ghxcall(otherCases) // output: name value will be this is otherCases
  // @ts-ignore
  testCases.do.ghxcall() // output: name value will be global
}
