<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
// import { useRouter } from 'vue-router'
// const router = useRouter()
// function goAdd() {
//   router.push('/add')
// }
// function backHome() {
//   router.push('/')
// }
// function goBack() {
//   router.go(-1)
// }

const goAdd = () => {
  router.push('/add')
}
const backHome = () => {
  router.push('/')
}
const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <h1>To Do List</h1>
  <el-scrollbar height="100%" wrap-style="height: 100%" wrap-class="container">
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-scrollbar>

  <!-- <div class="container"></div> -->
  <div class="to-do-list">
    <button type="button" class="btn_primary" @click="goBack">Go Back</button>
    <button type="button" class="btn_primary" @click="backHome">Home</button>
    <button type="button" class="btn_primary" @click="goAdd">Add</button>
  </div>
  <div class="copyright">Power by AaronGuo</div>
</template>

<style lang="scss">
.el-main {
  display: flex;
  flex-flow: column nowrap;
  // min-height: 100vh;
  height: 100%;
  padding: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.container {
  height: 100vh;
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
.copyright {
  width: 100%;
  padding: 20px 0;
  background-color: #ccc;
  color: #333;
  text-align: center;
}
</style>
