/*
 * @Author: HongxuanG
 * @Date: 2022-04-01 16:01:49
 * @Last Modified by: HongxuanG
 * @Last Modified time: 2022-04-06 18:10:09
 */
// 1. 处理执行器抛出的错误
// 2. 添加异常处理
// 3. 增加静态方法resolve和reject
var PromiseStatus;
(function (PromiseStatus) {
    PromiseStatus["Pending"] = "pending";
    PromiseStatus["Fulfilled"] = "fulfilled";
    PromiseStatus["Rejected"] = "rejected";
})(PromiseStatus || (PromiseStatus = {}));
var PromiseByMyself = /** @class */ (function () {
    function PromiseByMyself(executor) {
        var _this = this;
        this.status = PromiseStatus.Pending;
        this.value = null;
        this.reason = null;
        // 储存被异步函数耽误的Fulfilled状态的then里面的Fulfilled回调函数
        this.onFulfilledCallbacks = [];
        // 储存被异步函数耽误的Rejected状态的then里面的Rejected回调函数
        this.onRejectedCallbacks = [];
        // 解决
        this.resolve = function (value) {
            if (_this.status === PromiseStatus.Pending) {
                _this.status = PromiseStatus.Fulfilled;
                _this.value = value;
                // 有回调函数被存储起来，就执行
                while (_this.onFulfilledCallbacks.length) {
                    _this.onFulfilledCallbacks.shift()(value);
                }
            }
        };
        // 拒绝
        this.reject = function (reason) {
            if (_this.status === PromiseStatus.Pending) {
                _this.status = PromiseStatus.Rejected;
                _this.reason = reason;
                while (_this.onRejectedCallbacks.length) {
                    _this.onRejectedCallbacks.shift()(reason);
                }
            }
        };
        try {
            executor(this.resolve, this.reject);
        }
        catch (error) {
            this.reject(error);
        }
    }
    /**
     * 静态方法的resolve
     * @param value 值
     * @returns PromiseByMyself
     */
    PromiseByMyself.resolve = function (value) {
        if (value instanceof PromiseByMyself) {
            return value;
        }
        else {
            return new PromiseByMyself(function (resolve) {
                resolve(value);
            });
        }
    };
    /**
     * 静态方法的reject
     * @param reason 拒绝的鳄梨油
     * @returns PromiseByMyself
     */
    PromiseByMyself.reject = function (reason) {
        return new PromiseByMyself(function (resolve, reject) {
            reject(reason);
        });
    };
    PromiseByMyself.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        var onFulfilledFunc = typeof onFulfilled === 'function' ? onFulfilled : function (value) { return value; };
        var onRejectedFunc = typeof onRejected === 'function' ? onRejected : function (reason) { throw reason; };
        var promise2 = new PromiseByMyself(function (resolve, reject) {
            var fulfilledMicrotask = function () {
                // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
                queueMicrotask(function () {
                    try {
                        // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
                        var x = onFulfilledFunc(_this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (error) {
                        reject && reject(error);
                    }
                });
            };
            var rejectedMicrotask = function () {
                // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
                queueMicrotask(function () {
                    try {
                        // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
                        var x = onRejectedFunc(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (error) {
                        reject && reject(error);
                    }
                });
            };
            if (_this.status === PromiseStatus.Fulfilled) {
                // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
                fulfilledMicrotask();
            }
            else if (_this.status === PromiseStatus.Rejected) {
                rejectedMicrotask();
            }
            else if (_this.status === PromiseStatus.Pending) { // 还是pending 储存回调函数，等到resolve或者reject的时候才用上这些回调函数
                _this.onFulfilledCallbacks.push(fulfilledMicrotask);
                _this.onRejectedCallbacks.push(rejectedMicrotask);
            }
        });
        return promise2;
    };
    return PromiseByMyself;
}());
// 这里是处理分析then的第一个参数(onFulfilledFunc)return 的东西，第二个参数(onRejectedFunc)的东西
function resolvePromise(promise, x, resolve, reject) {
    var called = false;
    // 如果promise和x引用同一个对象，则用TypeError作为原因拒绝（reject）promise。
    if (promise === x) {
        return reject ? reject(new TypeError('不能调用自身, 你懂不懂promise啊!')) : new TypeError('不能调用自身, 你懂不懂promise啊!');
    }
    // 如果x是一个promise,采用promise的状态
    if (x instanceof PromiseByMyself) {
        x.then(resolve, reject);
    }
    else {
        if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
            try {
                // @ts-ignore
                var then = x.then;
                // 如果then是一个方法，把x当作this来调用它， 第一个参数为 resolvePromise，第二个参数为rejectPromise
                if (typeof then === 'function') {
                    then.call(x, function (y) {
                        // 如果resolvePromise和 rejectPromise都被调用，或者对同一个参数进行多次调用，第一次调用执行，任何进一步的调用都被忽略
                        if (called)
                            return;
                        called = true;
                        return resolvePromise(promise, y, resolve, reject);
                    }, function (r) {
                        // 如果resolvePromise和 rejectPromise都被调用，或者对同一个参数进行多次调用，第一次调用执行，任何进一步的调用都被忽略
                        if (called)
                            return;
                        called = true;
                        reject(r);
                    });
                }
                else {
                    // 如果then不是一个函数，用x完成(fulfill)
                    resolve(x);
                }
            }
            catch (e) {
                // 如果resolvePromise或 rejectPromise已被调用，忽略。
                if (called)
                    return;
                called = true;
                reject(e);
            }
        }
        else {
            resolve(x);
        }
    }
}
// let promise1 = new PromiseByMyself((resolve, reject) => {
//   console.log('1')
//   setTimeout(() => {
//     // 模拟请求是的错误
//     // throw new Error('执行器发生错误')
//     reject(1000)
//   }, 1000)
// })
// promise1.then().then().then().then().then((value) => {
//   console.log('继续then下去', value)
// }, (reason) => {
//   console.log('error', reason)
// })
// @ts-ignore
PromiseByMyself.deferred = function () {
    var result = {};
    // @ts-ignore
    result.promise = new PromiseByMyself(function (resolve, reject) {
        // @ts-ignore
        result.resolve = resolve;
        // @ts-ignore
        result.reject = reject;
    });
    return result;
};
// // 验证静态方法的resolve
// PromiseByMyself.resolve('name').then((res) => {
//   console.log(res)
// })
// console.log(PromiseByMyself.reject('error'))
module.exports = PromiseByMyself;
