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
  // 原理： 通过在context上创建symbol对象作为context的新属性，然后把this赋值给这个属性值
  // 这样 context上下文就被挂载了一个function，之后调用function，当调用完之后delete掉这个属性即可。

  
  // @ts-ignore
  Function.prototype.myapply = function (context, argsArr?: unknown[]) {
    const contextDescriptor = context || global || window
    const key = Symbol()
    // this指向 function
    contextDescriptor[key] = this
    argsArr = argsArr ?? []
    const result = contextDescriptor[key](argsArr)
    delete contextDescriptor[key]
    return result
  }
  // @ts-ignore
  testCases.do.myapply(otherCases, [1, 2, 3, 4])
}
