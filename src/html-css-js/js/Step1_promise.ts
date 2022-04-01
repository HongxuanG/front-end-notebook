namespace Step1{

  enum PromiseStatus {
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected'
  }
  interface Executor {
    (resolve: Function, reject?: Function): void
  }
  class PromiseByMyself {
    constructor(executor: Executor) {
      console.log('constructor', this)
      executor(this.resolve, this.reject)
    }
    status = PromiseStatus.Pending
    value: unknown = null
    reason: unknown = null
    resolve = (value: unknown) => {
      console.log('resolve里面的this', this)
      if (this.status === PromiseStatus.Pending) {
        this.status = PromiseStatus.Fulfilled
        this.value = value
      }
    }
    reject = (reason: unknown) => {  // 使用箭头函数定义而不是普通函数定义，因为里面的this会指向window或者undefined
      if (this.status === PromiseStatus.Pending) {
        this.status = PromiseStatus.Rejected
        this.reason = reason
      }
    }
    then(onFulilled: Function, onRejected?: Function) { // 使用箭头函数定义而不是普通函数定义，因为里面的this会指向window或者undefined
      if (this.status === PromiseStatus.Fulfilled) {
        onFulilled(this.value)
      } else if (this.status === PromiseStatus.Rejected) {
        onRejected && onRejected(this.reason)
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
    console.log(res)
  }, function (reason: unknown) {
    console.log(reason)
  })
}
