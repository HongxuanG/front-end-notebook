
function fn(num: number) {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      resolve(num * 2)
    }, 1000)
  })
}
function* gen() {
  // @ts-expect-error
  const num1 = yield fn(1)
  // @ts-expect-error
  const num2 = yield fn(num1)
  // @ts-expect-error
  const num3 = yield fn(num2)
  return num3
}
// const g = gen()
// const next1 = g.next();

// next1.value.then((res1: number) => {
//   console.log(next1);
//   console.log(res1);

//   const next2 = g.next(res1)
//   next2.value.then((res2: number) => {
//     console.log(next2);
//     console.log(res2);

//     const next3 = g.next(res2)
//     next3.value.then((res3: number) => {
//       console.log(next3);
//       console.log(res3);

//       console.log(g.next(res3));
//     })
//   })
// })
type PromiseValue<> = Promise<'name'>

function generatorToAsync(generatorFun: GeneratorFunction) {
  return function() {
    return new Promise((resolve, reject) => {
      const g = generatorFun()
      const next1 = g.next()
      next1.value.then((res1: number) => {
        const next2 = g.next(res1)
        next2.value.then((res2: number) => {
          const next3 = g.next(res2)
          next3.value.then((res3: number) => {
            resolve(g.next(res3).value)
          })
        })
      })
    })
  }
}
const asyncFn = generatorToAsync(gen as GeneratorFunction)
asyncFn().then((res) => {
  console.log(res)
})
