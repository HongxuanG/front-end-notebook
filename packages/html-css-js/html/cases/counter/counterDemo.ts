
let countTimer = null
let count = 0
const counterEle = document.querySelector('#counter') as HTMLElement

console.log(counterEle)
function counter(endTime){
  start(endTime)
}
// endTime 终点时间戳和当前时间戳的差值
function start(endTime){
  clearTimeout(countTimer)
  countTimer = setTimeout(()=>{
    if(+new Date > endTime){
      clearTimeout(countTimer)
    }else{
      let second = (endTime - +new Date()) / 1000  // 秒
      counterEle.innerText = second + '秒'
      start(endTime)
    }
  }, 30)
}
counter(1651940614893)
// setTimeout只是被设定了在30毫秒后被执行，计算当前时间戳和给出的时间戳的差值进行计算秒数
// 如果改成1000毫秒，将会1秒计算一次，设置30毫秒的话可以做到毫秒级计算
