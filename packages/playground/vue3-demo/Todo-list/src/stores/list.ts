import {defineStore} from 'pinia'
export const useListStore = defineStore('todolist', {
  state: () => ({
    todoList: [
      {
        id: 1,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
      {
        id: 2,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
      {
        id: 3,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
      {
        id: 4,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
      {
        id: 5,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
      {
        id: 6,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
      {
        id: 7,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
      {
        id: 8,
        todoEvent: '假数据家世界假数据家世界假数据家世界',
        isFinish: false,
      },
    ],
  }),
  getters: {

  },
  actions: {},
})
