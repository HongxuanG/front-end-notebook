import Queue from './queue';
function hotpotato(elementList: unknown[], num: number) {
  let queue = new Queue()
  const eliminatedList = []
  for (let i = 0; i < elementList.length; i++){
    queue.enqueue(elementList[i])
  }
  while (queue.size() > 1) {
    // 洗牌 从队尾出又从队头进
    for (let i = 0; i < num; i++){
      queue.enqueue(queue.dequeue())
    }
    eliminatedList.push(queue.dequeue())
  }
  return {
    eliminated: eliminatedList,
    winner: queue.dequeue()
  }
}

console.log(hotpotato(['john','jack','xiaohua','xiaoming','xiaoxi'], 3))
