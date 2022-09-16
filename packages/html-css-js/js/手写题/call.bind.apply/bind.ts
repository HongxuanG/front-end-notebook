// 手写bind
namespace CodingBindFunctionByMyself {
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
  class TestCasesClass {
    constructor(public name: string = 'this is TestCasesClass') {
    }
  }
  var global = {
    name: 'this is globalCases'
  }


  // 原理：返回一个函数，该函数入参要和bind的入参合在一起传给this
  // 需要注意的是：this可能是一个构造函数，需要做判断，内部需要通过new执行初始化


  // @ts-ignore
  Function.prototype.mybind = function (context, ...args) {
    const self = this
    const contextDescriptor = context ?? global ?? window
    return function internalFunc(this: any, ...subArgs: unknown[]) {
      // 当绑定的this是一个构造函数时
      // @ts-ignore
      if ((this as FunctionConstructor) instanceof internalFunc) {
        console.log(this.__proto__ === internalFunc.prototype)   // true 说明this.__proto__指向 internalFunc.prototype
        // @ts-ignore
        return new self(...args, ...subArgs)
      }
      return self.apply(contextDescriptor, args.concat(subArgs))
    }
  }
  // @ts-ignore
  // let bondCases = testCases.do.mybind(otherCases)
  // bondCases()
  // @ts-ignore
  // 自己写的bind
  let newHandler = TestCasesClass.mybind(otherCases)
  let test = new newHandler()
  console.log(test)
  // 这是原生的bind
  let newfun1 = TestCasesClass.bind(null, '要你寡')
  let bondFunction = new newfun1()
  console.log(bondFunction)
}

