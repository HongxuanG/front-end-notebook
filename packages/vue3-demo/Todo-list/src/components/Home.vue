<template>
  <List>
    <template v-for="(item, index) in statue" :key="item.id">
      <ListItem :todoEvent="item.todoEvent" :isFinish="item.isFinish" :id="item.id" @check="onTriggerCheck"></ListItem>
    </template>
  </List>
  <div ref="root">this is a root element</div>
</template>

<script lang="ts" setup>
import ListItem from './ListItem/ListItem.vue'
import { IListItem } from './ListItem/types'
import List from './List/List.vue'
import { reactive, ref } from 'vue'

const root = ref(null)

let statue = reactive<IListItem[]>([
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
])

const onTriggerCheck = (data: IListItem) => {
  console.log('data==>', data)
  const index = statue.findIndex(item=>item.id === data.id)
  statue[index].isFinish = !data.isFinish
}
</script>

<style scoped></style>
