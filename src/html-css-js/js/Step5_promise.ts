/*
 * @Author: HongxuanG 
 * @Date: 2022-04-01 16:01:49 
 * @Last Modified by: HongxuanG
 * @Last Modified time: 2022-04-02 17:29:15
 */
// 1. 处理执行器抛出的错误
// 2. 添加异常处理
// 3. 增加静态方法resolve和reject
enum PromiseStatus {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected'
}
type IResolve = (value: unknown) => PromiseByMyself | unknown
type IReject = (reason: unknown) => PromiseByMyself | unknown
type IThenCallback = (param: unknown) => PromiseByMyself | unknown

interface Executor {
  (resolve: IResolve, reject: IReject): void
}
class PromiseByMyself {
  constructor(executor: Executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }
  private status = PromiseStatus.Pending
  private value: unknown = null
  private reason: unknown = null
  // 储存被异步函数耽误的Fulfilled状态的then里面的Fulfilled回调函数
  private onFulfilledCallbacks: IThenCallback[] = []
  // 储存被异步函数耽误的Rejected状态的then里面的Rejected回调函数
  private onRejectedCallbacks: IThenCallback[] = []
  // 解决
  private resolve = (value: unknown) => {
    if (this.status === PromiseStatus.Pending) {
      this.status = PromiseStatus.Fulfilled
      this.value = value
      // 有回调函数被存储起来，就执行
      while (this.onFulfilledCallbacks.length) {
        (this.onFulfilledCallbacks.shift() as IThenCallback)(value)
      }
    }
  }
  // 拒绝
  private reject = (reason: unknown) => {  // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
    if (this.status === PromiseStatus.Pending) {
      this.status = PromiseStatus.Rejected
      this.reason = reason
      while (this.onRejectedCallbacks.length) {
        (this.onRejectedCallbacks.shift() as IThenCallback)(reason)
      }
    }
  }
  /**
   * 静态方法的resolve
   * @param value 值
   * @returns PromiseByMyself
   */
  static resolve(value: unknown) {
    if (value instanceof PromiseByMyself) {
      return value
    } else {
      return new PromiseByMyself((resolve) => {
        resolve(value)
      })
    }
  }
  /**
   * 静态方法的reject
   * @param reason 拒绝的鳄梨油
   * @returns PromiseByMyself
   */
  static reject(reason: unknown) {
    return new PromiseByMyself((resolve, reject) => {
      reject(reason)
    })
  }
  then(onFulfilled?: IThenCallback, onRejected?: IThenCallback) { // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
    let onFulfilledFunc = typeof onFulfilled === 'function' ? onFulfilled : (value: unknown) => value
    let onRejectedFunc = typeof onRejected === 'function' ? onRejected : (reason: unknown) => { throw reason }

    let promise2 = new PromiseByMyself((resolve, reject) => {
      let fulfilledMicrotask = () => {
        // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
        queueMicrotask(() => {
          try {
            // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
            let x = onFulfilledFunc(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject && reject(error)
          }

        })
      }
      let rejectedMicrotask = () => {
        // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
        queueMicrotask(() => {
          try {
            // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
            let x = onRejectedFunc(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject && reject(error)
          }

        })
      }

      if (this.status === PromiseStatus.Fulfilled) {
        // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
        fulfilledMicrotask()
      } else if (this.status === PromiseStatus.Rejected) {
        rejectedMicrotask()
      } else if (this.status === PromiseStatus.Pending) { // 还是pending 储存回调函数，等到resolve或者reject的时候才用上这些回调函数

        this.onFulfilledCallbacks.push(fulfilledMicrotask)
        this.onRejectedCallbacks.push(rejectedMicrotask)
      }
    });
    return promise2
  }
}
function resolvePromise(promise: PromiseByMyself, x: unknown, resolve?: IResolve, reject?: IReject) {
  if (x instanceof PromiseByMyself) {
    if (promise === x) {
      return reject ? reject(new TypeError('不能调用自身, 你懂不懂promise啊!')) : new TypeError('不能调用自身, 你懂不懂promise啊!')
    }
    x.then(resolve, reject)
  } else {
    resolve && resolve(x)
  }
}
let promise1 = new PromiseByMyself((resolve, reject) => {
  console.log('1')
  setTimeout(() => {
    // 模拟请求是的错误
    // throw new Error('执行器发生错误')
    reject(1000)
  }, 1000)
})
promise1.then().then().then().then().then((value) => {
  console.log('继续then下去', value)
}, (reason) => {
  console.log('error', reason)
})


// @ts-ignore
PromiseByMyself.deferred = function () {
  let result = {}
  // @ts-ignore
  result.promise = new PromiseByMyself((resolve, reject) => {
    // @ts-ignore
    result.resolve = resolve
    // @ts-ignore
    result.reject = reject
  })
  return result
}

// // 验证静态方法的resolve
// PromiseByMyself.resolve('name').then((res) => {
//   console.log(res)
// })
// console.log(PromiseByMyself.reject('error'))
module.exports = PromiseByMyself

