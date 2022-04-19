// 手写apply
namespace CodingApplyFunctionByMyself {
  let otherCases = {
    name: 'this is otherCases'
  }
  let testCases = {
    name: 'this is testCases',
    do(argArray: unknown[]) {
      console.log(this)
      console.log("name value will be", this.name, ', and its argument array are', argArray)
    }
  }
  var global = {
    name: 'this is globalCases'
  }
  // 原理和call差不多，只是参数是数组
  // @ts-ignore
  Function.prototype.myapply = function (context, argsArr?: unknown[]) {
    const contextDescriptor = context || global || window
    const key = Symbol()
    contextDescriptor[key] = this
    argsArr = argsArr ?? []
    const result = contextDescriptor[key](argsArr)
    delete contextDescriptor[key]
    return result
  }
  // @ts-ignore
  testCases.do.myapply(otherCases, [1, 2, 3, 4])
}
