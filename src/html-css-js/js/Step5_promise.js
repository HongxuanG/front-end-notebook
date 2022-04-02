/*
 * @Author: HongxuanG
 * @Date: 2022-04-01 16:01:49
 * @Last Modified by: HongxuanG
 * @Last Modified time: 2022-04-02 16:17:15
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
        var promise = new PromiseByMyself(function (resolve, reject) {
            var fulfilledMicrotask = function () {
                // 等待promise被初始化完成，解决方案是通过微任务queueMicrotask延迟执行
                queueMicrotask(function () {
                    try {
                        // 处理onFulfilled的返回值类型，如果是promise类型.then 如果不是promise类型resolve()
                        var x = onFulfilledFunc(_this.value);
                        handleReturnType(promise, x, resolve, reject);
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
                        handleReturnType(promise, x, resolve, reject);
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
        return promise;
    };
    return PromiseByMyself;
}());
function handleReturnType(promise, x, resolve, reject) {
    if (x instanceof PromiseByMyself) {
        if (promise === x) {
            return reject ? reject(new TypeError('不能调用自身, 你懂不懂promise啊!')) : new TypeError('不能调用自身, 你懂不懂promise啊!');
        }
        x.then(resolve, reject);
    }
    else {
        resolve && resolve(x);
    }
}
var promise = new PromiseByMyself(function (resolve, reject) {
    console.log('1');
    setTimeout(function () {
        // 模拟请求是的错误
        // throw new Error('执行器发生错误')
        reject(1000);
    }, 1000);
});
promise.then().then().then().then().then(function (value) {
    console.log('继续then下去', value);
}, function (reason) {
    console.log('error', reason);
});
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
