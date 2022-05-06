<script setup lang="ts">
import { IListItem } from './types';

const { todoEvent, isFinish, id } = defineProps<{
  todoEvent: IListItem['todoEvent'],
  isFinish: IListItem['isFinish'],
  id: IListItem['id']
}>()
const emit = defineEmits<{
  (e: 'check', data: IListItem): void
}>()
function oncheck() {
  emit('check', {isFinish, id, todoEvent})
}
</script>

<template>
  <div class="list-item">
    <div :class="['checkbox', isFinish ? 'checkbox_checked' : '']" @click="oncheck"></div>
    <div :class="['list--item_eventName', isFinish ? 'list-item_isFinish' : '']">{{ todoEvent }}</div>
  </div>
</template>

<style scoped>
.list-item {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 20px;
  background-color: bisque;
  border: 1px solid #d2d2d2;
  color: #333;
  font-size: 20px;
}
.checkbox {
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #d2d2d2;
  margin-right: 20px;
  cursor: pointer;
}
.checkbox_checked::after {
  content: '';
  display: block;
  background-color: chartreuse;
}
.list-item_isFinish {
  text-decoration: line-through;
  font-style: italic;
}
</style>
