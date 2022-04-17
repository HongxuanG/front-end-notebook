/*
 * @Author: HongxuanG
 * @Date: 2022-04-01 16:01:49
 * @Last Modified by: HongxuanG
 * @Last Modified time: 2022-04-07 15:16:05
 */
// 1. 处理执行器抛出的错误
// 2. 添加异常处理

// 3. 增加静态方法resolve和reject
enum PromiseStatus {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}
type IResolve<T> = (value?: T | PromiseLike<T>) => void
type IReject = (reason?: any) => void
type onFulfilled<T, TResult1> = ((value: T) => TResult1 | PromiseLike<T>) | null | undefined
type onRejected<TResult2> = ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined

function isPromise(value: any) {
  return ((typeof value === 'object' || typeof value === 'function') && value !== null && typeof value.then === 'function')
}

// 执行器
interface Executor<T> {
  (resolve: IResolve<T>, reject: IReject): void
}
class PromiseByMyself<T = unknown> {
  constructor(executor: Executor<T>) {
    try {
      // new 做的第一件事是：立即执行 new Promise的参数: (resolve, reject)=>{...}
      // 而resolve和reject是一个方法
      executor(this.resolve, this.reject)
    }
    catch (error: any) {
      this.reject(error)
    }
  }

  private status = PromiseStatus.Pending
  private value!: T // !: 是不初始化，但是不报错的意思
  private reason: any = null
  // 储存被异步函数耽误的Fulfilled状态的then里面的Fulfilled回调函数
  private onFulfilledCallbacks: IResolve<T>[] = []
  // 储存被异步函数耽误的Rejected状态的then里面的Rejected回调函数
  private onRejectedCallbacks: IReject[] = []
  // 解决
  private resolve: IResolve<T> = (value) => {
    if (isPromise(value)) {
      // 实现resolve(promise) 最后输出promise的resolve这样的一个值穿透
      (value as PromiseLike<T>).then(this.resolve, this.reject)
      return
    }
    queueMicrotask(() => {
      if (this.status === PromiseStatus.Pending) {
        console.log('当前的状态是pending')
        this.status = PromiseStatus.Fulfilled
        this.value = value as T
        // 有回调函数被存储起来，就执行
        while (this.onFulfilledCallbacks.length) {
          (this.onFulfilledCallbacks.shift() as IResolve<T>)(value)
        }
      }
    })
  }

  // 拒绝
  private reject: IReject = (reason) => { // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
    queueMicrotask(() => {
      if (this.status === PromiseStatus.Pending) {
        this.status = PromiseStatus.Rejected
        this.reason = reason
        while (this.onRejectedCallbacks.length) {
          (this.onRejectedCallbacks.shift() as IReject)(reason)
        }
      }
    })
  }

  /**
   * 静态方法的resolve
   * @param value 值
   * @returns PromiseByMyself
   */
  static resolve<T>(value?: T | PromiseLike<T>): PromiseByMyself<T> {
    if (value instanceof PromiseByMyself) {
      return value
    }
    else {
      return new PromiseByMyself((resolve) => {
        resolve?.(value)
      })
    }
  }

  /**
   * 静态方法的reject
   * @param reason 拒绝的理由
   * @returns PromiseByMyself
   */
  static reject<E>(reason?: E) {
    return new PromiseByMyself((resolve, reject) => {
      reject?.(reason)
    })
  }

  /**
   * 可以链式调用
   * @param onFulfilled 成功状态后执行的函数
   * @param onRejected 拒绝状态后执行的函数
   * @returns 返回一个new Promise而不是自身的promise实例
   */
  then = <TResult1 = T, TResult2 = never>(
    onFulfilled?: onFulfilled<T, TResult1>,
    onRejected?: onRejected<TResult2>,
  ) => { // 使用箭头函数定义而不是普通函数定义，因为使用普通函数的话里面的this会指向window或者undefined
    const onFulfilledFunc = typeof onFulfilled === 'function' ? onFulfilled : (value: any) => value
    const onRejectedFunc = typeof onRejected === 'function'
      ? onRejected
      : (reason: unknown) => {
        throw reason
      }

    const promise2 = new PromiseByMyself<TResult1 | TResult2>((resolve, reject) => {
      const fulfilledMicrotask = () => {
        // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
        queueMicrotask(() => {
          try {
            // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
            const x = onFulfilledFunc(this.value)
            this.resolvePromise(promise2, x, resolve, reject)
          }
          catch (error) {
            reject && reject(error)
          }
        })
      }
      const rejectedMicrotask = () => {
        // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
        queueMicrotask(() => {
          try {
            // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
            const x = onRejectedFunc(this.reason)
            this.resolvePromise(promise2, x, resolve, reject)
          }
          catch (error) {
            reject && reject(error)
          }
        })
      }

      if (this.status === PromiseStatus.Fulfilled) {
        // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
        fulfilledMicrotask()
      }
      else if (this.status === PromiseStatus.Rejected) {
        rejectedMicrotask()
      }
      else if (this.status === PromiseStatus.Pending) { // 还是pending 储存回调函数，等到resolve或者reject的时候才用上这些回调函数
        this.onFulfilledCallbacks.push(fulfilledMicrotask)
        this.onRejectedCallbacks.push(rejectedMicrotask)
      }
    })
    return promise2
  }

  // 这里是处理分析then的第一个参数(onFulfilledFunc)return 的东西，第二个参数(onRejectedFunc)的东西
  private resolvePromise = <T>(
    promise: PromiseByMyself<T>,
    x: T | PromiseLike<T>,
    resolve?: IResolve<T>,
    reject?: IReject,
  ) => {
    let called = false
    // 如果promise和x引用同一个对象，则用TypeError作为原因拒绝（reject）promise。
    if (promise === x) {
      return reject?.(new TypeError('不能调用自身, 你懂不懂promise啊!'))
    }

    // 如果x是一个promise,采用promise的状态
    if (x instanceof PromiseByMyself) {
      if (x.status === PromiseStatus.Pending) {
        x.then((y) => {
          this.resolvePromise(promise, y, resolve, reject)
        }, reject)
      }
      else if (x.status === PromiseStatus.Fulfilled) {
        resolve?.(x.value)
      }
      else if (x.status === PromiseStatus.Rejected) {
        reject?.(x.reason)
      }
    }
    else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let then: PromiseLike<T>['then']
      try {
        then = (x as PromiseLike<T>).then
      }
      catch (e) {
        return reject?.(e)
      }
      // 如果then是一个方法，把x当作this来调用它， 第一个参数为 resolvePromise，第二个参数为rejectPromise
      if (typeof then === 'function') {
        try {
          then.call(x, (y) => {
            // 如果resolvePromise和 rejectPromise都被调用，或者对同一个参数进行多次调用，第一次调用执行，任何进一步的调用都被忽略
            if (called) {
              return
            }
            called = true
            this.resolvePromise(promise, y, resolve, reject)
          }, (r: unknown) => {
            // 如果resolvePromise和 rejectPromise都被调用，或者对同一个参数进行多次调用，第一次调用执行，任何进一步的调用都被忽略
            if (called) {
              return
            }
            called = true
            reject?.(r)
          })
        }
        catch (e) {
          // 如果resolvePromise或 rejectPromise已被调用，忽略。
          if (called) {
            return
          }
          called = true
          reject?.(e)
        }
      }
      else {
        // 如果then不是一个函数，用x完成(fulfill)
        // @ts-expect-error
        resolve?.(x)
      }
    }
    else {
      // @ts-expect-error
      resolve?.(x)
    }
  }
}
const promise2 = new PromiseByMyself((resolve, reject) => {
  resolve('值穿透')
})
const promise1 = new PromiseByMyself((resolve, reject) => {
  console.log('1')
  resolve?.('鸡哥')
  console.log('2')
})
promise1.then((value) => {
  console.log('继续then下去', value)
})

// @ts-expect-error
PromiseByMyself.deferred = function() {
  const result = {}
  // @ts-expect-error
  result.promise = new PromiseByMyself((resolve, reject) => {
    // @ts-expect-error
    result.resolve = resolve
    // @ts-expect-error
    result.reject = reject
  })
  return result
}
// 错误：当x是对象或者function时 x = x.then
// promise-Aplus-test

// // 验证静态方法的resolve
// PromiseByMyself.resolve('name').then((res) => {
//   console.log(res)
// })
// console.log(PromiseByMyself.reject('error'))
module.exports = PromiseByMyself

// resolve值穿透实例
// let promise1 = new Promise((resolve, reject) => {
//   resolve('name1')
// })
// let promsie2 = new Promise((resolve, reject) => {
//   return resolve(promise1)
// })
// promsie2.then(res => {
//   console.log(res)
// })
