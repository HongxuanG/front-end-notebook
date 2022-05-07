<template>
  <List>
    <template v-for="(item, index) in statue" :key="item.id">
      <ListItem :todoEvent="item.todoEvent" :isFinish="item.isFinish" :id="item.id" @check="onTriggerCheck"></ListItem>
    </template>
  </List>
  <button @click="subtract">{{ count }}</button>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import ListItem from './ListItem/ListItem.vue'
import { IListItem } from './ListItem/types'
import List from './List/List.vue'
import { isReactive, reactive, ref, toRef, watch, watchEffect } from 'vue'

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
  const index = statue.findIndex((item) => item.id === data.id)
  statue[index].isFinish = !data.isFinish
}

let count = ref(20)
let user = reactive({
  name: 'ghx',
  age: 23,
})

watch(
  count,
  (value, oldValue) => {
    console.log(`old:${oldValue}, new:${value}`)
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(()=>_.cloneDeep(user), (value, oldValue) => {
  console.log('value', value)
  console.log('oldValue', oldValue)
})

const subtract = () => {
  count.value--
  user.age--
}

const countEffect = ref(0)

watchEffect((onInvalidate)=>{
  onInvalidate(()=>{
    console.log('清除副作用被触发')
  })
  console.log('watchEffect执行',countEffect.value)
})

setTimeout(()=>{
  countEffect.value++
}, 2000)

</script>

<style scoped></style>
