<script setup lang="ts">
import { useRouter } from 'vue-router'
import ListItem from './components/ListItem.vue'
import List from './components/List.vue'
import Effect from './components/Effect.vue'
const router = useRouter()
function goEdit() {
  router.push('/edit')
}
function goAdd() {
  router.push('/add')
}
</script>

<template>
  <Effect></Effect>
  <h1>To Do List</h1>

  <div class="to-do-list">
    <button type="button" @click="goEdit">Edit</button>
    <button type="button" @click="goAdd">Add</button>
  </div>
  <div class="container">
    <List>
      <ListItem todoEvent="假数据家世界假数据家世界假数据家世界" :isFinish="false"></ListItem>
      <ListItem todoEvent="假数据家世界假数据家世界假数据家世界" :isFinish="false"></ListItem>
      <ListItem todoEvent="假数据家世界假数据家世界假数据家世界" :isFinish="false"></ListItem>
      <ListItem todoEvent="假数据家世界假数据家世界假数据家世界" :isFinish="false"></ListItem>
      <ListItem todoEvent="假数据家世界假数据家世界假数据家世界" :isFinish="false"></ListItem>
    </List>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
