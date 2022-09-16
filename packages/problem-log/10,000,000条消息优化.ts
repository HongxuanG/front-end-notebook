// [掘进原文](https://juejin.cn/post/7087804464912039944)
// 背景：直播的弹幕消息，根据进度条变化循环整个消息列表，找出这个时间戳应该出现的消息

// 模拟10000000条消息
const messageList = new Array(10000000).fill(1).map((item, index) => {
  return {
    time: (index + 1) * 1000,
    content: `这是第${index + 1}秒发送的消息`
  }
})
// 发送的消息列表
const sendList: {
  time: number
  content: string
}[]  = []
function getMessage(time: number) {
  let j = 0; // 循环次数
  for(let i = 0, len = messageList.length; i < len; i++) {
    const item = messageList[i];
    j++;
    // 这里的time如果不是1000、2000，而是1234、1214这种，就需要取一个浮动范围
    // 我这里就是简单用了定时器，所以比较简单
    if(item.time === time) {
      sendList.push(messageList[i])
      messageList.splice(i, 1)
      i--;
    } else if(sendList.length > 0) {
        break;
    }
  }
  console.log('播放进度', time)
  console.log('循环的次数', j);
  console.log('接收的消息的长度', sendList.length, sendList);
  console.log('原始消息的长度', messageList.length);
}
// 这里模拟直播进度 时间变化事件触发
let time = 0
setInterval(() => {
  time += 1000
  getMessage(time)
}, 1000)
