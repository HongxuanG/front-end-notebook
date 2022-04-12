import Stack from './stack'
// decimal to binary
console.log('decimalToBinary', decimalToBinary(6))
function decimalToBinary(decNumber: number) {
  const remStack = new Stack()
  let number = decNumber
  let rem
  let binaryString = ''
  if (decNumber == 0) return '00'
  if(decNumber == 1) return '01'
  // number == 0 不进入
  while (number > 0) {
    rem = Math.floor(number % 2)
    remStack.push(rem)
    number = Math.floor(number / 2)
  }
  while (!remStack.isEmpty()) {
    binaryString += remStack.pop().toString()
  }
  return binaryString
}
// 源码有bug 当decNumber == 0 时 return 的是 空字符串 当decNumber == 1 时 return 的是 1 而不是01
