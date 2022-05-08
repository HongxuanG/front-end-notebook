// ## 尾调用是什么？
// 尾调用就是  某一个函数最后一步调用另一个函数

// 尾调用的形式
;(function(){
  // 例子:
  function g(x){
    console.log('内部函数')
  }
  function m(x){
    console.log('另一个内部函数')
  }

  // 尾调用
  function f(x){
    return g(x)
  }
  // 或者：
  function f1(x){
    if(x>0){
      return m(x)
    }
    return g(x)
  }



})()

// 换言之：只要最后一步是调用函数就行，其他附加的操作都不算！

// 例如

;(function(){

  function g(x) {
    console.log('内部函数')
  }
  function m(x) {
    console.log('另一个内部函数')
  }

  // 不是尾调用
  function f2(x){
    let y = g(x)    // 最后有赋值操作，不属于尾调用
    return y
  }
  function f(x) {
    // @ts-ignore
    return g(x) + 2  // 最后调用函数的时候还有一个运算操作，不属于尾调用
  }
  // 或者：
  function f1(x) {
    g(x)  // 至于这里为什么不是尾调用，它实际上最后还是做了return undefined这一步
  }
})()

// 尾调用优化

// 前置概念：调用帧、调用栈

// 函数的调用会在内存形成一个调用记录，这就叫`调用帧`。
// 函数里面调用函数，以此一直递归下去，这就形成了`调用栈`，内部函数调用完之后把结果返回给外部函数，内部函数这个`调用帧`才会消失

;(function(){


  function g(x){
    console.log(x)
  }
  function f(){
    let m = 1
    let n = 2
    return g(m+n)
  }
  f()

  // 当函数多层嵌套函数的时候，并且每一个函数都是尾调用的，因为m和n都是值类型，g()内部执行的时候不会引用到m和n，调用完g()之后，函数f就完全结束了
  // 所以完全可以把f()的调用帧删除，只保留g()的调用帧

  // 上述代码完全可以变成：
  // 直接调用g函数
  g(3)




})()
  // 不过这里要注意：内部函数不再使用外部函数的内部变量的时候（就像上面的m和n，换成引用类型或者内部函数的内部使用了m和n，就不能进行尾调用优化了），内部函数的调用帧才能取代外部函数的调用帧
;(function(){

  
  function f() {
    let m = 1
    let n = 2
    function g() {
      console.log(m, n)
    }
    return g()
  }
  f()


})()


// ## 尾递归是什么？

// 函数尾调用自身就是尾递归。由于只存在一个调用帧，所以不会发生栈溢出


function factorial(n){
  if(n===1)return 1;
  return n * factorial(n-1)
}
// 上面这个函数斌没有尾调用，所以也不叫尾递归。因为需要每层递归都需要保留n的值，所以保存了n个调用帧，复杂度O(n)


// 改写成尾递归后
function factorialWithTailCall(n, total){
  if(n === 1) return total
  return factorialWithTailCall(n-1, n * total)
}
// 保存下来的调用帧始终只有一个，复杂度O(1)


// 斐波那契数列
// 没有尾递归
function Fibonacci(n){
  if(n <= 1) return 1
  return Fibonacci(n-1) + Fibonacci(n-2)
}
// 因为函数的最后一步还有一个运算操作，所以不是尾调用，自然也不是尾递归

function FibonacciWithTailCall(n, ac1 = 1, ac2 = 1){
  if(n <= 1) return ac2
  return FibonacciWithTailCall(n-1, ac2, ac1 + ac2)
}



// ## 什么是蹦床函数？

// 能把递归执行转成循环执行，是递归的优化方案，减少调用栈，避免内存溢出


function trampoline(f){
  while(f && f instanceof Function){
    f = f()
  }
  return f
}
// 它通过while判断f还是不是一个函数，如果f是函数就继续执行f() 并把f函数的返回值重新赋值给f，这样就一直循环调用f()了
// 应用
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1)
  } else {
    return x
  }
}
console.log(trampoline(sum(1, 100000)))



