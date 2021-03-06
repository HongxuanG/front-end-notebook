/*
 * @Author: HongxuanG
 * @Date: 2022-04-01 14:23:41
 * @Last Modified by: HongxuanG
 * @Last Modified time: 2022-04-01 15:57:47
 */
namespace Step3 {
  // 解决同步情况下then的链式调用
  enum PromiseStatus {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
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
    reject = (reason: unknown) => { // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
      if (this.status === PromiseStatus.Pending) {
        this.status = PromiseStatus.Rejected
        this.reason = reason
        while (this.onRejectedCallbacks.length) {
          (this.onRejectedCallbacks.shift() as IThenCallback)(reason)
        }
      }
    }

    then(onFulfilled: IThenCallback, onRejected?: IThenCallback) { // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
      return new PromiseByMyself((resolve, reject) => {
        if (this.status === PromiseStatus.Fulfilled) {
          const returnBody = onFulfilled(this.value)
          // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
          resolvePromise(returnBody, resolve, reject)
        }
        else if (this.status === PromiseStatus.Rejected) {
          onRejected && onRejected(this.reason)
        }
        else if (this.status === PromiseStatus.Pending) { // 还是pending 储存回调函数，等到resolve或者reject的时候才用上这些回调函数
          this.onFulfilledCallbacks.push(onFulfilled)
          // 可选
          onRejected && this.onRejectedCallbacks.push(onRejected)
        }
      })
    }
  }
  function resolvePromise(x: unknown, resolve: IResolve, reject?: IReject) {
    if (x instanceof PromiseByMyself) {
      x.then(resolve, reject)
    }
    else {
      resolve(x)
    }
  }
  // 没有触发
  const promise = new PromiseByMyself((resolve) => {
    resolve('success') // 异步执行 then都跑完了才改变状态
  })
  promise.then((res: unknown) => {
    console.log(1)
    console.log(res) // 2秒过后 output: success
    return '11'
  }).then((res: unknown) => {
    console.log(2)
    console.log(res) // 2秒过后 output: 11
    return '44'
  }).then((res: unknown) => {
    console.log(3)
    console.log(res) // 2秒过后 output: 44
    return '55'
  }).then((res: unknown) => {
    console.log(4)
    console.log(res) // 2秒过后 output: 55
  })

}
