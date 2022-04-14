import Stack from './stack'
// decimal to binary
console.log('decimalToBinary', decimalToBinary(6))
// 源码有bug 当decNumber == 0 时 return 的是 空字符串 当decNumber == 1 时 return 的是 1 而不是01
function decimalToBinary(decNumber: number) {
  const remStack = new Stack()
  let number = decNumber
  let rem
  let binaryString = ''
  if (decNumber == 0) return '00'
  if (decNumber == 1) return '01'
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
// 大于或大于等于
type EqualOrGreaterThan<
  T extends number,
  U extends number,
  UseEqual extends boolean = false
  > = EqualGreaterThanHelper<T, U, UseEqual>



type EqualGreaterThanHelper<
  T extends number,
  U extends number,
  UseEqual extends boolean,
  CountArr extends unknown[] = []> =
  T extends U
  ? UseEqual
  : CountArr['length'] extends T
  ? false
  : CountArr['length'] extends U
  ? true
  : EqualGreaterThanHelper<T, U, UseEqual, [...CountArr, unknown]>


// 小于或小于等于
type EqualOrLessthan<
  T extends number,
  U extends number,
  UseEqual extends boolean = false
  > = EqualLessthanHelper<T, U, UseEqual>

type EqualLessthanHelper<
  T extends number,
  U extends number,
  UseEqual extends boolean,
  CountArr extends unknown[] = []> =
  T extends U
  ? UseEqual
  : CountArr['length'] extends T
  ? true
  : CountArr['length'] extends U
  ? false
  : EqualLessthanHelper<T, U, UseEqual, [...CountArr, unknown]>
// 求数值范围
type Range<L extends number, H extends number> = RangeHelper<L, H>
type RangeHelper<
  L extends number,
  H extends number,
  Result extends number[] = [],
  CountArr extends unknown[] = []> =
  EqualOrGreaterThan<CountArr['length'], L, true> extends true
  ? EqualOrLessthan<CountArr['length'], H, true> extends true
  ? RangeHelper<L, H, [...Result, CountArr['length']], [...CountArr, unknown]>
  : Result[number]
  : RangeHelper<L, H, Result, [...CountArr, unknown]>

type BaseRange = Range<2, 36> // 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
// decimal 转 任何进制数
function baseConverter(decNumber: number, base: BaseRange) {
  const remStack = new Stack()
  const dights = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let number = decNumber
  let baseString = ''  // 最终结果
  let rem   // 余数
  if (!(base >= 2 && base <= 36)) return baseString
  while (number > 0) {
    rem = number % base
    remStack.push(rem)
    number = Math.floor(number / base)
  }
  while (!remStack.isEmpty()) {
    baseString += dights[remStack.pop()]
  }
  return baseString
}
console.log('5的二进制', baseConverter(100345 , 35))
