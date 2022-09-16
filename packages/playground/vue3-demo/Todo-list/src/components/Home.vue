<template>
  <List>
    <template v-for="(item, index) in todoList" :key="item.id">
      <ListItem :todoEvent="item.todoEvent" :isFinish="item.isFinish" :id="item.id" @check="onTriggerCheck"></ListItem>
    </template>
  </List>
  <button @click="subtract">{{ count }}</button>
  <button @click="resetStore">重置数据</button>
  <input ref="input" value="111" />
  <p>x: {{ x }}, y: {{ y }}</p>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import ListItem from './ListItem/ListItem.vue'
import { IListItem } from './ListItem/types'
import List from './List/List.vue'
import { reactive, ref, watch, watchEffect } from 'vue'
import { useMouseMove } from '../composables/useMouseMove'
import { storeToRefs } from 'pinia'
import { useListStore } from '../stores/list'
const listStore = useListStore()

// 获取store里面的todolist
const { todoList } = storeToRefs(listStore)

const onTriggerCheck = (data: IListItem) => {
  const index = todoList.value.findIndex((item) => item.id === data.id)
  todoList.value[index].isFinish = !data.isFinish
}
// 重置 store
const resetStore = () => {
  listStore.$reset()
}





// hook
const { x, y } = useMouseMove()
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
watchEffect(
  () => {
    console.log('获取到的input的DOM实例', input.value)
  },
  {
    flush: 'post',
  }
)
// 这时我们将flush设置为'post'，表示要在render渲染dom之后执行，这样也会推迟watchEffect执行，在首次渲染完成之后执行
</script>

<style scoped></style>
