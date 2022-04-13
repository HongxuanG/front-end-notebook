import Deque from './deque'

function palindromeChecker(aString: string) {
  if (aString === undefined || aString === null || (aString !== null && aString.length === 0)) {
    return false
  }
  const deque = new Deque()
  // 清除多余空格
  const lowerString = aString.toLocaleLowerCase().split(' ').join('')
  let isEqual = true
  let firstChar, lastChar
  // 字符串入队列
  for (let i = 0; i < lowerString.length; i++){
    deque.addBack(lowerString.charAt(i))
  }
  // 
  while (deque.size() > 1 && isEqual) {
    firstChar = deque.removeFront()
    lastChar = deque.removeBack()
    // 队头和队尾不相同，返回false
    if (firstChar !== lastChar) {
      isEqual = false
    }
  }
  return isEqual
}
