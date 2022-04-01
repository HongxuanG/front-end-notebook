namespace Step2{
  // 解决异步情况下then的回调函数不执行的问题
  enum PromiseStatus {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected'
  }
  interface Executor {
    (resolve: (arg: unknown)=>void, reject?: (arg: unknown)=>void): void
  }
  type ThenCallback = (param: unknown)=>PromiseByMyself | void
  class PromiseByMyself {
    constructor(executor: Executor) {
      executor(this.resolve, this.reject)
    }
    status = PromiseStatus.Pending
    value: unknown = null
    reason: unknown = null
    onFulfilledCallback: ThenCallback | null = null
    onRejectedCallback: ThenCallback | null = null
    resolve = (value: unknown) => {
      if (this.status === PromiseStatus.Pending) {
        this.status = PromiseStatus.Fulfilled
        this.value = value
        // 有回调函数被存储起来，就执行
        this.onFulfilledCallback && this.onFulfilledCallback(value)
      }
    }
    reject = (reason: unknown) => {  // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
      if (this.status === PromiseStatus.Pending) {
        this.status = PromiseStatus.Rejected
        this.reason = reason
        this.onRejectedCallback && this.onRejectedCallback(reason)
      }
    }
    then(onFulfilled: ThenCallback, onRejected?: ThenCallback) { // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
      if (this.status === PromiseStatus.Fulfilled) {
        onFulfilled(this.value)
      } else if (this.status === PromiseStatus.Rejected) {
        onRejected && onRejected(this.reason)
      } else if (this.status === PromiseStatus.Pending) { // 还是pending 储存回调函数，等到resolve或者reject的时候才用上这些回调函数
        this.onFulfilledCallback = onFulfilled
        onRejected && (this.onRejectedCallback = onRejected)
      }
    }
  }
  // 没有触发
  let promise = new PromiseByMyself((resolve, rejects) => {
    setTimeout(() => {
      resolve('success') // 异步执行 then都跑完了才改变状态
    }, 2000)
  })
  promise.then(function (res: unknown) {
    console.log(res) // 2秒过后 output: success
  })
}
