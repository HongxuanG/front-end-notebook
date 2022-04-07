

function fn1(num: number) {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      resolve(num * 2)
    }, 1000)
  })
}
// yield 用于接收next传进来的参数
// 这里fn1返回的是一个pending状态的promise 模拟异步请求
function* gen1() {
  // @ts-ignore
  const num1 = yield fn1(1)
  // @ts-ignore
  const num2 = yield fn1(num1)
  // @ts-ignore
  const num3 = yield fn1(num2)
  return num3
}
// 把上面的Generator函数当做async修饰的函数，yield当做await就好了，这样容易理解为什么这样做
// 取出promise的resolve的参数类型
type PromiseResolveValue<T> = T extends PromiseLike<infer V> ? V : T
function generatorToAsync1(generatorFun: GeneratorFunction) {
  return function (this: void, ...args: any[]) {
    let that = this
    const gen = generatorFun.apply(that, args)
    return new Promise((resolve, reject) => {
      // 用递归解决了不断调用next的问题，done 为true 就是递归的终止条件
      function next<T>(key: keyof Generator, arg?: T): Promise<T> | void {
        let res
        try {
          res = gen[key](arg)

        } catch (e) {
          reject(e)
        }
        const { value, done } = res as IteratorResult<T>
        if (done) {
          return resolve(value)
        } else {
          // 这里为什么不直接value.then(....)而是要Promise.resolve(value).then(....)呢？
          // 因为value是pending的promise实例的话这种写法当然可以啦，但是value有可能不是一个promise实例哦
          // @ts-ignore
          return Promise.resolve(value).then(val => next('next', val), reason => next('throw', reason))
        }
      }
      next('next')
    })
  }
}
// @ts-ignore
const asyncFun = generatorToAsync1(gen1)
asyncFun().then(res => console.log(res))
