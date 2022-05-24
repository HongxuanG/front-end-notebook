// mate data
let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
]
// result like this
let result = [
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门2',
        pid: 1,
        children: [],
      },
      {
        id: 3,
        name: '部门3',
        pid: 1,
        children: [
          // 结果 ,,,
        ],
      },
    ],
  },
]
// 递归遍历查找求解
function getChildren(data: any, result: any, pid: any) {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = { ...item, children: [] }
      result.push(newItem)
      getChildren(data, newItem.children, item.id)
    }
  }
}
function arrayToTree(data: any, pid: any) {
  const result: any[] = []
  getChildren(data, result, pid)
  return result
}
console.log(arrayToTree(arr, 0))
// 不用递归
// 利用map
function arrayToTreeWithMap(metaData: any){
  const result = []
  const itemMap: any = {}
  for(const item of metaData){
    itemMap[item.id] = {...item, children: []}
  }
  for(const item of metaData){
    const id = item.id
    const pid = item.pid
    const treeItem = itemMap[id]
    if (pid === 0) {
      result.push(treeItem)
    } else {
      if(!itemMap[pid]){
        itemMap[pid] = {
          children: []
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}
function arrayToTreeWithMap1(metaData: any){
  const result = []
  const itemMap: any = {}
  for (const item of metaData) {
    const id = item.id
    const pid = item.pid
    if(!item[id]){
      itemMap[id] = {
        children: []
      }
    }
    itemMap[id] = { ...item, children: itemMap[id]['children'] }
    const treeItem = itemMap[id]
    if(pid === 0){
      result.push(treeItem)
    }else{
      if(!itemMap[pid]){
        itemMap[pid] = {
          children: []
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}


// 以下为无关代码，就是excel转对象的过程
let metaData = [
  { name: '张三', age: 20 },
  { name: '李四', age: 21 },
  { name: '王五', age: 22 },
]
let formatData = { name: '姓名', age: '年龄' }
type formatDataType = typeof formatData
type FormatedItem = {
  [K in keyof formatDataType as formatDataType[K]]: unknown
}
function fn11(data: typeof metaData, format: typeof formatData) {
  let resultArr: FormatedItem[] = []
  let tempObj: FormatedItem = {}
  for (let value of data.values()) {
    tempObj[format.name] = value.name
    tempObj[format.age] = value.age
    resultArr.push(tempObj)
  }
  return resultArr
}
console.log(fn11(metaData, formatData))
/**
 * [
    { '姓名': '王五', '年龄': 22 },
    { '姓名': '王五', '年龄': 22 },
    { '姓名': '王五', '年龄': 22 }
  ]
 */
