/*
 * @Author: HongxuanG 
 * @Date: 2022-04-01 16:01:49 
 * @Last Modified by: HongxuanG
 * @Last Modified time: 2022-04-02 11:37:25
 */
namespace Step4 {
  // 1. 解决循环调用的问题，抛出错误
  enum PromiseStatus {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected'
  }
  interface Executor {
    (resolve: (arg: unknown) => void, reject?: (arg: unknown) => void): void
  }
  type IThenCallback = (param: unknown) => PromiseByMyself | unknown
  type IResolve = (value: unknown) => void
  type IReject = (reason: unknown) => void | undefined
  class PromiseByMyself {
    constructor(executor: Executor) {
      executor(this.resolve, this.reject)
    }
    status = PromiseStatus.Pending
    value: unknown = null
    reason: unknown = null
    // 储存被异步函数耽误的Fulfilled状态的then里面的Fulfilled回调函数
    onFulfilledCallbacks: IThenCallback[] = []
    // 储存被异步函数耽误的Rejected状态的then里面的Rejected回调函数
    onRejectedCallbacks: IThenCallback[] = []
    // 解决
    resolve = (value: unknown) => {
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
    reject = (reason: unknown) => {  // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
      if (this.status === PromiseStatus.Pending) {
        this.status = PromiseStatus.Rejected
        this.reason = reason
        while (this.onRejectedCallbacks.length) {
          (this.onRejectedCallbacks.shift() as IThenCallback)(reason)
        }
      }
    }
    then(onFulfilled: IThenCallback, onRejected?: IThenCallback) { // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
      let promise = new PromiseByMyself((resolve, reject) => {
        if (this.status === PromiseStatus.Fulfilled) {
          // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
          queueMicrotask(() => {
            // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
            let returnBody = onFulfilled(this.value)

            resolvePromise(promise, returnBody, resolve, reject)
          })
        } else if (this.status === PromiseStatus.Rejected) {
          onRejected && onRejected(this.reason)
        } else if (this.status === PromiseStatus.Pending) { // 还是pending 储存回调函数，等到resolve或者reject的时候才用上这些回调函数

          this.onFulfilledCallbacks.push(onFulfilled)
          // 可选
          onRejected && this.onRejectedCallbacks.push(onRejected)
        }
      })
      return promise
    }
  }
  function resolvePromise(promise: PromiseByMyself, x: unknown, resolve: IResolve, reject?: IReject) {
    if (x instanceof PromiseByMyself) {
      if (promise === x) {
        return reject ? reject(new TypeError('不能调用自身, 你懂不懂promise啊!')) : new TypeError('不能调用自身, 你懂不懂promise啊!')
      }
      x.then(resolve, reject)
    } else {
      resolve(x)
    }
  }
  // 没有触发
  let promise = new PromiseByMyself((resolve) => {
    resolve('success')
  })
  const cature1 = promise.then(function (res: unknown) {
    console.log(1);
    console.log(res)
    return cature1
  })
  // TypeError: 不能调用自身, 你懂不懂promise啊!
  // good job！这就完成了报错了，通过queueMicrotask获取到已初始化的promise，然后传到resolvePromise里面
  cature1.then(function (res: unknown) {
    console.log(2);
    console.log(res) // 2秒过后 output: 11
  }, function (reason) {
    console.log('then的回调函数return的是自身')
    console.log(reason)
  })

}

