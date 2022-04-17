<script setup lang='ts'>
interface ListItem {
  todoEvent: string;
  isFinish: boolean;
}
defineProps<ListItem>()
</script>

<template>
  <div class="list-item">
    <div :class="['list--item_eventName', isFinish ? 'list-item_isFinish' : '']">{{todoEvent}}</div>
  </div>
</template>

<style scoped>
.list-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: bisque;
  border: 1px solid #d2d2d2;
  color: #333;
  font-size: 20px;
}
.list-item_isFinish{
  text-decoration: line-through;
  font-style: italic;
}
</style>
