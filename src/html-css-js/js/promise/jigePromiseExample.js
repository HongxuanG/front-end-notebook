// 首先将三种状态提出来，用枚举管理
let State;
(function(State) {
  State.PENDING = 'pending'
  State.FULFILLED = 'fulfilled'
  State.REJECTED = 'rejected'
})(State || (State = {}))
// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = function(value) {
  return typeof value === 'function'
}
const MyPromise = /** @class */ (function() {
  // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数，给类的构造方法constructor添加一个参数func
  function MyPromise(func) {
    const _this = this
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    // result为成功态时接收的终值
    this.resolve = function(result) {
      // 只能由pedning状态 => fulfilled状态 (避免调用多次resolve reject)
      if (_this.PromiseState === State.PENDING) {
        /**
                 * 为什么resolve和reject要加setTimeout?
                 * 2.2.4规范 onFulfilled1 和 onRejected1 只允许在 execution context 栈仅包含平台代码时运行.
                 * 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled1 和 onRejected1 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
                 * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
                 */
        setTimeout(() => {
          _this.PromiseState = State.FULFILLED
          _this.PromiseResult = result
          /**
                     * 在执行resolve或者reject的时候，遍历自身的callbacks数组，
                     * 看看数组里面有没有then那边 保留 过来的 待执行函数，
                     * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
                     */
          _this.onFulfilledCallbacks.forEach((callback) => {
            callback(result)
          })
        })
      }
    }
    // reason为拒绝态时接收的终值
    this.reject = function(reason) {
      // 只能由pedning状态 => rejected状态 (避免调用多次resolve reject)
      if (_this.PromiseState === State.PENDING) {
        setTimeout(() => {
          _this.PromiseState = State.REJECTED
          _this.PromiseResult = reason
          _this.onRejectedCallbacks.forEach((callback) => {
            callback(reason)
          })
        })
      }
    }
    /**
         * [注册 fulfilled 状态 / rejected 状态 对应的回调函数]
         * @param {function} onFulfilled1 fulfilled状态时 执行的函数
         * @param {function} onRejected1 rejected状态时 执行的函数
         * @returns {function} newPromsie 返回一个新的promise对象
         */
    this.then = function(onFulfilled1, onRejected1) {
      /**
             * 参数校验：Promise规定then方法里面的两个参数如果不是函数的话就要被忽略
             * 所谓“忽略”并不是什么都不干，
             * 对于onFulfilled来说“忽略”就是将value原封不动的返回，
             * 对于onRejected来说就是返回拒因，
             * onRejected因为是错误分支，我们返回拒因时应该throw一个Error
             */
      onFulfilled1 = isFunction(onFulfilled1)
        ? onFulfilled1
        : function(value) {
          return value
        }
      onRejected1 = isFunction(onRejected1)
        ? onRejected1
        : function(reason) {
          throw reason
        }
      // 2.2.7 规范 then 方法必须返回一个 promise 对象
      var promise2 = new MyPromise((resolve, reject) => {
        if (_this.PromiseState === State.FULFILLED) {
          /**
                     * 为什么这里要加定时器setTimeout？
                     * 2.2.4规范 onFulfilled1 和 onRejected1 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
                     * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
                     * 实践中要确保 onFulfilled1 和 onRejected1 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
                     * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
                     */
          setTimeout(() => {
            try {
              // 2.2.7.1规范 如果 onFulfilled1 或者 onRejected1 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
              const x = onFulfilled1 === null || onFulfilled1 === void 0 ? void 0 : onFulfilled1(_this.PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            }
            catch (e) {
              // 2.2.7.2 如果 onFulfilled1 或者 onRejected1 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
              reject === null || reject === void 0 ? void 0 : reject(e) // 捕获前面onFulfilled中抛出的异常
            }
          })
        }
        if (_this.PromiseState === State.REJECTED) {
          setTimeout(() => {
            try {
              const x = onRejected1 === null || onRejected1 === void 0 ? void 0 : onRejected1(_this.PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            }
            catch (e) {
              reject === null || reject === void 0 ? void 0 : reject(e)
            }
          })
        }
        if (_this.PromiseState === State.PENDING) {
          // pending 状态保存的 resolve() 和 reject() 回调也要符合 2.2.7.1 和 2.2.7.2 规范
          _this.onFulfilledCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onFulfilled1 === null || onFulfilled1 === void 0 ? void 0 : onFulfilled1(_this.PromiseResult)
                resolvePromise(promise2, x, resolve, reject)
              }
              catch (e) {
                reject === null || reject === void 0 ? void 0 : reject(e)
              }
            })
          })
          _this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onRejected1 === null || onRejected1 === void 0 ? void 0 : onRejected1(_this.PromiseResult)
                resolvePromise(promise2, x, resolve, reject)
              }
              catch (e) {
                reject === null || reject === void 0 ? void 0 : reject(e)
              }
            })
          })
        }
      })
      return promise2
    }
    this.PromiseState = State.PENDING // 指定Promise对象的状态属性 PromiseState，初始值为pending
    this.onFulfilledCallbacks = [] // 保存成功回调
    this.onRejectedCallbacks = [] // 保存失败回调
    try {
      /**
             * func()传入resolve和reject，
             * resolve()和reject()方法在外部调用，这里需要注意一下this指向是否正确，如果不正确，需要用bind修正一下
             * new 对象实例时，自动执行func()
             */
      func(this.resolve, this.reject)
    }
    catch (err) {
      // 生成实例时(执行resolve和reject)，如果报错，就把错误信息传入给reject()方法，并且直接执行reject()方法
      this.reject(err)
    }
  }
  /**
     * Promise.resolve()
     * @param {[type]} value 要解析为 Promise 对象的值
     */
  MyPromise.resolve = function(value) {
    // 如果这个值是一个 promise ，那么将返回这个 promise
    if (value instanceof MyPromise) {
      return value
    }

    // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
    return new MyPromise((resolve) => {
      resolve === null || resolve === void 0 ? void 0 : resolve(value)
    })
  }
  /**
     * Promise.reject()
     * @param {*} reason 表示Promise被拒绝的原因
     * @returns
     */
  MyPromise.reject = function(reason) {
    // 不需要额外判断
    return new MyPromise((resolve, reject) => {
      reject === null || reject === void 0 ? void 0 : reject(reason)
    })
  }
  return MyPromise
}())
/**
 * 对 resolve、reject 进行改造增强，针对 resolve 和 reject 中不同值的情况进行处理
 * @param  {promise} promise2 promise1.then 方法返回的新的 promise 对象
 * @param  {[type]} x         promise1 中 onFulfilled1 或 onRejected1 的返回值
 * @param  {[type]} resolve   promise2 的 resolve 方法
 * @param  {[type]} reject    promise2 的 reject 方法
 */
var resolvePromise = function(promise2, x, resolve, reject) {
  // 2.3.1 规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 reject
  if (promise2 === x) {
    return reject === null || reject === void 0 ? void 0 : reject(new TypeError('Chaining cycle detected for promise'))
  }

  // 2.3.2 规范 如果 x 为 Promise ，则使 promise2 接受 x 的状态
  if (x instanceof MyPromise) {
    if (x.PromiseState === State.PENDING) {
      /**
             * 2.3.2.1 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
             *         注意"直至 x 被执行或拒绝"这句话，
             *         这句话的意思是：x 被执行x，如果执行的时候拿到一个y，还要继续解析y
             */
      x.then((y) => {
        resolvePromise(promise2, y, resolve, reject)
      }, reject)
    }
    if (x.PromiseState === State.FULFILLED) {
      // 2.3.2.2 如果 x 处于执行态，用相同的值执行 promise
      resolve === null || resolve === void 0 ? void 0 : resolve(x.PromiseResult)
    }
    if (x.PromiseState === State.REJECTED) {
      // 2.3.2.3 如果 x 处于拒绝态，用相同的据因拒绝 promise
      reject === null || reject === void 0 ? void 0 : reject(x.PromiseResult)
    }
  }
  else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 2.3.3 如果 x 为对象或函数
    let then = void 0
    try {
      // 2.3.3.1 把 x.then 赋值给 then
      then = x.then
    }
    catch (e) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject === null || reject === void 0 ? void 0 : reject(e)
    }
    /**
         * 2.3.3.3
         * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
         * 传递两个回调函数作为参数，
         * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
         */
    if (typeof then === 'function') {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      let called_1 = false // 避免多次调用
      try {
        then.call(x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            if (called_1) {
              return
            }

            called_1 = true
            resolvePromise(promise2, y, resolve, reject)
          },
          // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called_1) {
              return
            }

            called_1 = true
            reject === null || reject === void 0 ? void 0 : reject(r)
          })
      }
      catch (e) {
        /**
                 * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
                 * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                 */
        if (called_1) {
          return
        }

        called_1 = true
        // 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
        reject === null || reject === void 0 ? void 0 : reject(e)
      }
    }
    else {
      // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
      resolve === null || resolve === void 0 ? void 0 : resolve(x)
    }
  }
  else {
    // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve === null || resolve === void 0 ? void 0 : resolve(x)
  }
}
// 下面这部分代码是用来跑测试用例的，和 Promise 本身无关
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
Reflect.set(MyPromise, 'deferred', () => {
  const result = {}
  Reflect.set(result, 'promise', new MyPromise((resolve, reject) => {
    Reflect.set(result, 'resolve', resolve)
    Reflect.set(result, 'reject', reject)
  }))
  return result
})
module.exports = MyPromise
