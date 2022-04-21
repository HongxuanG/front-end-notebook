<script setup lang="ts">
import { useRouter } from 'vue-router'
<<<<<<< HEAD
import ListItem from './components/ListItem.vue'
import List from './components/List.vue'
import Effect from './components/Effect.vue'
=======
>>>>>>> 1f1a0c9c894a7b7b4ceac954a30e83c0dfccc9a7
const router = useRouter()
function goEdit() {
  router.push('/edit')
}
function goAdd() {
  router.push('/add')
}
function backHome() {
  router.push('/')
}
function goBack() {
  router.go(-1)
}
</script>

<template>
  <Effect></Effect>
  <h1>To Do List</h1>

  <div class="to-do-list">
    <button type="button" class="btn_primary" @click="goBack">Go Back</button>
    <button type="button" class="btn_primary" @click="backHome">Home</button>
    <button type="button" class="btn_primary" @click="goEdit">Edit</button>
    <button type="button" class="btn_primary" @click="goAdd">Add</button>
  </div>
  <div class="container">
    <router-view></router-view>
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
.container {
  margin: 20px auto 0;
  width: 60%;
}
.btn_primary {
  border-radius: 5px;
  padding: 1em 1em;
  font-size: 1em;
  background-color: #fff;
  box-shadow: 1px 1px 2px 3px #d2d2d2;
}
</style>
