"use strict";
var Status;
(function (Status) {
    Status["PENDING"] = "pending";
    Status["FULFILLED"] = "fulfilled";
    Status["REJECTED"] = "rejected";
})(Status || (Status = {}));
/*
    将判断 Promise 提出来，减少代码冗余，不然每次都需要使用：
    ((typeof value === 'object' && value !== null) ||
      typeof value === 'function') && typeof (value as PromiseLike<T>).then === 'function'
     来进行判断，同时也有更好的 typescript 提示
*/
function isPromise(value) {
    return (((typeof value === 'object' && value !== null) ||
        typeof value === 'function') &&
        typeof value.then === 'function');
}
function resolvePromise(promise2, x, resolve, reject) {
    // 不能引用同一个对象，不然会无限循环的
    if (promise2 === x) {
        var e = new TypeError('TypeError: Chaining cycle detected for promise #<MyPromise>');
        // 清空栈信息，不太清楚为什么 Promise 要清除这个，先不管了，继续往下
        e.stack = '';
        // 直接进入错误的回调
        return reject(e);
    }
    var called = false; // 防止多次调用
    // 如果 x 为 Promise，通过上面的知识我们知道判断是否是个 Promise 或者像 Promise 我们是判断一个对象是否有 then 方法，可以发现在下面判断是否是对象或者函数中也有相同的判断，所以这里我们可以直接省略
    // 如果 x 是对象或函数
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {
        try {
            /*
            存储了一个指向 x.then 的引用，然后测试并调用该引用，以避免多次访问 x.then 属性。这种预防措施确保了该属性的一致性，因为其值可能在检索调用时被改变。
            注：这里可以用我们封装的判断方法 isPromise 判断，但是既然跟着解决过程走，那么还是老老实实操作一下吧
            */
            // 手动转一下类型
            var then = x.then;
            if (typeof then === 'function') {
                // 这里其实就是调用传入的 Promise 的 then 方法，下面代码就是执行了 x.then(()=>{},()=>{})
                then.call(x, function (y) {
                    if (called)
                        return;
                    called = true;
                    // 如果是 Promise，我们应该递归地获取到最终状态的值，传入相同的处理函数，不论是成功还是失败都能直接抛出到最外层
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if (called)
                        return;
                    called = true;
                    // 如果传入的 Promise 被拒绝，直接抛出到最外层
                    reject(r);
                });
            }
            else {
                // 不是 Promise 对象，当做普通值处理
                resolve(x);
            }
        }
        catch (e) {
            // 如果中间有错误。直接变为拒绝态
            // 但是如果出现错误之前已经改变了状态，那么久不用管
            if (called)
                return;
            called = true;
            reject(e);
        }
    }
    else {
        // 普通值处理
        resolve(x);
    }
}
var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        this.status = Status.PENDING;
        this.onFulfilledCallback = []; //成功的回调
        this.onRejectedCallback = []; //失败的回调
        try {
            // 防止 this 丢失
            executor(this._resolve.bind(this), this._reject.bind(this));
        }
        catch (e) {
            this._reject(e);
        }
    }
    // 内部的 resolve 函数，就是我们实例 Promise 传入给用户调用的 resolve
    MyPromise.prototype._resolve = function (value) {
        var _this = this;
        // 推入事件环最后，这里应该是微任务， ES6 的 Promise 内部并不是用 setTimeout，这里我们只能用 setTimeout 进行模拟微任务
        try {
            if (isPromise(value)) {
                value.then(this._resolve.bind(this), this._reject.bind(this));
                return;
            }
            setTimeout(function () {
                // 如果是 pending 状态就变为 fulfilled
                if (_this.status === Status.PENDING) {
                    _this.status = Status.FULFILLED;
                    _this.value = value;
                    // resolve 后执行 .then 时传入的回调
                    _this.onFulfilledCallback.forEach(function (fn) { return fn(); });
                }
            });
        }
        catch (error) {
            this._reject(error);
        }
    };
    // 内部的 reject 函数，就是我们实例 Promise 传入给用户调用的 reject
    MyPromise.prototype._reject = function (reason) {
        var _this = this;
        // 大体用法同上，这里不用进行值穿透，所以不用判断是否为 Promise 对象了
        setTimeout(function () {
            if (_this.status === Status.PENDING) {
                _this.status = Status.REJECTED;
                _this.reason = reason;
                _this.onRejectedCallback.forEach(function (fn) { return fn(); });
            }
        });
    };
    MyPromise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        // 保证是函数
        var onfulfilledFn = typeof onfulfilled === 'function'
            ? onfulfilled
            : function (v) { return v; };
        var onrejectedFn = typeof onrejected === 'function'
            ? onrejected
            : function (e) {
                throw e;
            };
        // 将下面的 onfulfilled 改成 onfulfilledFn，onrejected 改成 onrejectedFn 就行了
        // 现在我们将这个新生成的 Promise 和现在的 Promise 相互联系
        var promise2 = new MyPromise(function (resolve, reject) {
            if (_this.status === Status.FULFILLED) {
                setTimeout(function () {
                    try {
                        //  获取到 x，然后与要返回的 Promise 产生联系
                        var x = onfulfilledFn(_this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }
            if (_this.status === Status.REJECTED) {
                setTimeout(function () {
                    try {
                        //  获取到 x，然后与要返回的 Promise 产生联系
                        var x = onrejectedFn(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }
            if (_this.status === Status.PENDING) {
                // 如果为 pending，需要将 onFulfilled 和 onRejected 函数都存放起来，状态确定后再依次执行
                // 执行回调的时候有 setTimeout，这里就不加了
                _this.onFulfilledCallback.push(function () {
                    try {
                        var x = onfulfilledFn(_this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                _this.onRejectedCallback.push(function () {
                    try {
                        var x = onrejectedFn(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }
        });
        return promise2;
    };
    MyPromise.prototype["catch"] = function (onrejected) {
        return this.then(null, onrejected);
    };
    MyPromise.resolve = function (value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise(function (resolve) {
            resolve(value);
        });
    };
    MyPromise.reject = function (reason) {
        return new MyPromise(function (resolve, reject) {
            reject(reason);
        });
    };
    // 无论如何都会执行，不会传值给回调函数
    MyPromise.prototype["finally"] = function (onfinally) {
        return this.then(function (value) {
            // 如果 onfinally 返回的是一个 thenable 也会等返回的 thenable 状态改变才会进行后续的 Promise
            return MyPromise.resolve(typeof onfinally === 'function' ? onfinally() : onfinally).then(function () { return value; });
        }, function (reason) {
            return MyPromise.resolve(typeof onfinally === 'function' ? onfinally() : onfinally).then(function () {
                throw reason;
            });
        });
    };
    MyPromise.all = function (values) {
        return new MyPromise(function (resolve, reject) {
            // PromiseLike<T> 对象会跟踪转换为 T
            var resultArr = [];
            // 获取迭代器对象
            var iter = values[Symbol.iterator]();
            //  判断是否已经全部完成了
            var doneArr = [];
            // 获取值 {value:xxx, done: false}
            var cur = iter.next();
            // 判断迭代器是否迭代完毕同时将最后得到的值放入结果数组中
            var resolveResult = function (value, index, done) {
                resultArr[index] = value;
                doneArr[index] = true;
                if (done && doneArr.every(function (item) { return item; })) {
                    resolve(resultArr);
                }
            };
            var _loop_1 = function (i) {
                var value = cur.value;
                doneArr.push(false);
                cur = iter.next();
                if (isPromise(value)) {
                    value.then(function (value) {
                        resolveResult(value, i, cur.done);
                    }, reject);
                }
                else {
                    resolveResult(value, i, cur.done);
                }
            };
            for (var i = 0; !cur.done; i++) {
                _loop_1(i);
            }
        });
    };
    MyPromise.race = function (values) {
        return new MyPromise(function (resolve, reject) {
            var iter = values[Symbol.iterator]();
            var cur = iter.next();
            while (!cur.done) {
                var value = cur.value;
                cur = iter.next();
                if (isPromise(value)) {
                    value.then(resolve, reject);
                }
                else {
                    // 普通值,这时的值为 T，但是 Typescript 无法再深度判断了，需要自己手动转换
                    resolve(value);
                }
            }
        });
    };
    MyPromise.allSettled = function (values) {
        return new MyPromise(function (reslove) {
            var resultArr = [];
            var doneArr = [];
            // 获取迭代器
            var iter = values[Symbol.iterator]();
            // 当前值
            var cur = iter.next();
            var resolveResult = function (value, index, done) {
                resultArr[index] = {
                    status: Status.FULFILLED,
                    value: value
                };
                doneArr[index] = true;
                if (done && doneArr.every(function (item) { return item; })) {
                    reslove(resultArr);
                }
            };
            var _loop_2 = function (i) {
                var value = cur.value;
                doneArr.push(false);
                cur = iter.next();
                if (isPromise(value)) {
                    value.then(function (value) {
                        resolveResult(value, i, cur.done);
                    }, function (reason) {
                        // 这里和 resolve 基本也没什么区别，修改一下状态和属性就ok了
                        resultArr[i] = {
                            status: Status.REJECTED,
                            reason: reason
                        };
                        doneArr[i] = true;
                        if (cur.done && doneArr.every(function (item) { return item; })) {
                            reslove(resultArr);
                        }
                    });
                    // 不是 thenable 直接存储
                }
                else {
                    resolveResult(value, i, cur.done);
                }
            };
            for (var i = 0; !cur.done; i++) {
                _loop_2(i);
            }
        });
    };
    // 与 MyPromise.all 正好相反
    MyPromise.any = function (values) {
        return new MyPromise(function (resolve, reject) {
            // 接收迭代器
            var iter = values[Symbol.iterator]();
            var cur = iter.next();
            var doneArr = [];
            var _loop_3 = function (i) {
                var value = cur.value;
                cur = iter.next();
                doneArr.push(false);
                if (isPromise(value)) {
                    // 如果为 thenable，根据该 thenable 的状态进行判断
                    value.then(resolve, function () {
                        doneArr[i] = true;
                        // 只有传入迭代器的值全是 thenable 并且 thenable 的状态全部为 rejected 才会触发
                        if (cur.done && doneArr.every(function (item) { return item; })) {
                            //应该抛出 AggregateError 的错误类型，但是因为 AggregateError 因为是实验版本，所有只有最新版浏览器才会有，我这里就用 Error代替了
                            var e = new Error('All promises were rejected');
                            e.stack = '';
                            reject(e);
                        }
                    });
                }
                else {
                    resolve(value);
                }
            };
            for (var i = 0; !cur.done; i++) {
                _loop_3(i);
            }
        });
    };
    return MyPromise;
}());
//@ts-ignore
MyPromise.defer = MyPromise.deferred = function () {
    var dfd = {};
    dfd.promise = new MyPromise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};
module.exports = MyPromise;
