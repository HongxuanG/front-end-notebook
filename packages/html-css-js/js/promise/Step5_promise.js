'use strict'
/*
 * @Author: HongxuanG
 * @Date: 2022-04-01 16:01:49
 * @Last Modified by: HongxuanG
 * @Last Modified time: 2022-04-07 14:37:33
 */
// 1. 处理执行器抛出的错误
// 2. 添加异常处理
exports.__esModule = true
// 3. 增加静态方法resolve和reject
let PromiseStatus;
(function(PromiseStatus) {
  PromiseStatus.Pending = 'pending'
  PromiseStatus.Fulfilled = 'fulfilled'
  PromiseStatus.Rejected = 'rejected'
})(PromiseStatus || (PromiseStatus = {}))
function isPromise(value) {
  return ((typeof value === 'object' || typeof value === 'function') && value !== null && typeof value.then === 'function')
}
const PromiseByMyself = /** @class */ (function() {
  function PromiseByMyself(executor) {
    const _this = this
    this.status = PromiseStatus.Pending
    this.reason = null
    // 储存被异步函数耽误的Fulfilled状态的then里面的Fulfilled回调函数
    this.onFulfilledCallbacks = []
    // 储存被异步函数耽误的Rejected状态的then里面的Rejected回调函数
    this.onRejectedCallbacks = []
    // 解决
    this.resolve = function(value) {
      if (isPromise(value)) {
        // 实现resolve(promise) 最后输出promise的resolve这样的一个值穿透
        value.then(_this.resolve, _this.reject)
        return
      }
      queueMicrotask(() => {
        if (_this.status === PromiseStatus.Pending) {
          _this.status = PromiseStatus.Fulfilled
          _this.value = value
          // 有回调函数被存储起来，就执行
          while (_this.onFulfilledCallbacks.length) {
            _this.onFulfilledCallbacks.shift()(value)
          }
        }
      })
    }
    // 拒绝
    this.reject = function(reason) {
      queueMicrotask(() => {
        if (_this.status === PromiseStatus.Pending) {
          _this.status = PromiseStatus.Rejected
          _this.reason = reason
          while (_this.onRejectedCallbacks.length) {
            _this.onRejectedCallbacks.shift()(reason)
          }
        }
      })
    }
    /**
         * 可以链式调用
         * @param onFulfilled 成功状态后执行的函数
         * @param onRejected 拒绝状态后执行的函数
         * @returns 返回一个new Promise而不是自身的promise实例
         */
    this.then = function(onFulfilled, onRejected) {
      const onFulfilledFunc = typeof onFulfilled === 'function'
        ? onFulfilled
        : function(value) {
          return value
        }
      const onRejectedFunc = typeof onRejected === 'function'
        ? onRejected
        : function(reason) {
          throw reason
        }
      var promise2 = new PromiseByMyself((resolve, reject) => {
        const fulfilledMicrotask = function() {
          // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
          queueMicrotask(() => {
            try {
              // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
              const x = onFulfilledFunc(_this.value)
              _this.resolvePromise(promise2, x, resolve, reject)
            }
            catch (error) {
              reject && reject(error)
            }
          })
        }
        const rejectedMicrotask = function() {
          // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
          queueMicrotask(() => {
            try {
              // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
              const x = onRejectedFunc(_this.reason)
              _this.resolvePromise(promise2, x, resolve, reject)
            }
            catch (error) {
              reject && reject(error)
            }
          })
        }
        if (_this.status === PromiseStatus.Fulfilled) {
          // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
          fulfilledMicrotask()
        }
        else if (_this.status === PromiseStatus.Rejected) {
          rejectedMicrotask()
        }
        else if (_this.status === PromiseStatus.Pending) { // 还是pending 储存回调函数，等到resolve或者reject的时候才用上这些回调函数
          _this.onFulfilledCallbacks.push(fulfilledMicrotask)
          _this.onRejectedCallbacks.push(rejectedMicrotask)
        }
      })
      return promise2
    }
    // 这里是处理分析then的第一个参数(onFulfilledFunc)return 的东西，第二个参数(onRejectedFunc)的东西
    this.resolvePromise = function(promise, x, resolve, reject) {
      let called = false
      // 如果promise和x引用同一个对象，则用TypeError作为原因拒绝（reject）promise。
      if (promise === x) {
        return reject === null || reject === void 0 ? void 0 : reject(new TypeError('不能调用自身, 你懂不懂promise啊!'))
      }

      // 如果x是一个promise,采用promise的状态
      if (x instanceof PromiseByMyself) {
        if (x.status === PromiseStatus.Pending) {
          x.then((y) => {
            _this.resolvePromise(promise, y, resolve, reject)
          }, reject)
        }
        else if (x.status === PromiseStatus.Fulfilled) {
          resolve === null || resolve === void 0 ? void 0 : resolve(x.value)
        }
        else if (x.status === PromiseStatus.Rejected) {
          reject === null || reject === void 0 ? void 0 : reject(x.reason)
        }
      }
      else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let then = void 0
        try {
          then = x.then
        }
        catch (e) {
          return reject === null || reject === void 0 ? void 0 : reject(e)
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
              _this.resolvePromise(promise, y, resolve, reject)
            }, (r) => {
              // 如果resolvePromise和 rejectPromise都被调用，或者对同一个参数进行多次调用，第一次调用执行，任何进一步的调用都被忽略
              if (called) {
                return
              }
              called = true
              reject === null || reject === void 0 ? void 0 : reject(r)
            })
          }
          catch (e) {
            // 如果resolvePromise或 rejectPromise已被调用，忽略。
            if (called) {
              return
            }
            called = true
            reject === null || reject === void 0 ? void 0 : reject(e)
          }
        }
        else {
          // 如果then不是一个函数，用x完成(fulfill)
          // @ts-expect-error
          resolve === null || resolve === void 0 ? void 0 : resolve(x)
        }
      }
      else {
        // @ts-expect-error
        resolve === null || resolve === void 0 ? void 0 : resolve(x)
      }
    }
    try {
      executor(this.resolve, this.reject)
    }
    catch (error) {
      this.reject(error)
    }
  }
  /**
     * 静态方法的resolve
     * @param value 值
     * @returns PromiseByMyself
     */
  PromiseByMyself.resolve = function(value) {
    if (value instanceof PromiseByMyself) {
      return value
    }
    else {
      return new PromiseByMyself((resolve) => {
        resolve === null || resolve === void 0 ? void 0 : resolve(value)
      })
    }
  }
  /**
     * 静态方法的reject
     * @param reason 拒绝的理由
     * @returns PromiseByMyself
     */
  PromiseByMyself.reject = function(reason) {
    return new PromiseByMyself((resolve, reject) => {
      reject === null || reject === void 0 ? void 0 : reject(reason)
    })
  }
  return PromiseByMyself
}())
// let promise2 = new PromiseByMyself((resolve, reject) => {
//   resolve('值穿透')
// })
// let promise1 = new PromiseByMyself((resolve, reject) => {
//   console.log('1')
//   setTimeout(() => {
//     // 模拟请求是的错误
//     // throw new Error('执行器发生错误')
//     resolve?.(promise2)
//   }, 1000)
// })
// promise1.then((value) => {
//   console.log('继续then下去', value)
// })
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
