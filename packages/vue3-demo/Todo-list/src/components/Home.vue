<template>
  <List>
    <template v-for="(item, index) in statue" :key="item.id">
      <ListItem :todoEvent="item.todoEvent" :isFinish="item.isFinish" :id="item.id" @check="onTriggerCheck"></ListItem>
    </template>
  </List>
  <button @click="subtract">{{ count }}</button>
  <input ref="input" value="111" />
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

watch(
  () => _.cloneDeep(user),
  (value, oldValue) => {
    console.log('value', value)
    console.log('oldValue', oldValue)
  }
)

const subtract = () => {
  count.value--
  user.age--
}

const countEffect = ref(0)

watchEffect((onInvalidate) => {
  onInvalidate(() => {
    console.log('清除副作用被触发')
  })
  console.log('watchEffect执行', countEffect.value)
})

setTimeout(() => {
  countEffect.value++
}, 2000)

// 当ref模板引用在watchEffect被访问时，由于watchEffect的执行时机在render之前，所以ref并不能被访问到。
// watchEffect的第二个参数option flush默认值为'pre'，表示watchEffect的执行将会在render渲染dom之前执行
const input = ref(null)
watchEffect(() => {
  console.log('获取到的input的DOM实例', input.value)
}, {
  flush: 'post'
})
// 这时我们将flush设置为'post'，表示要在render渲染dom之后执行，这样也会推迟watchEffect执行，在首次渲染完成之后执行
</script>

<style scoped></style>
