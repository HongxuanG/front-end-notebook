<script setup lang='ts'>
import { ref } from 'vue';
import { useListStore } from '../stores/list';


const listStore = useListStore()
let eventNamed = ref('')
const showDialog = ref(false)
function onshowDialog(){
  if(eventNamed.value.trim() === '') return
  showDialog.value = true
}
function onconfirm(){
  if(eventNamed.value.trim() === '') return
  listStore.todoList.push({
    id: Math.random(),
    todoEvent: eventNamed.value,
    isFinish: false
  })
  alert('已添加成功！')
}
function onclose(){
  showDialog.value = false

}
</script>

<template>
  <h3>待办事项</h3>
  <input type="text" placeholder="添加待办事项" v-model="eventNamed">
  <button @click="onshowDialog">确认添加</button>

  <teleport to="body">
    <div id="dialog" class="dialog__add" v-if="showDialog">
      <h2 class="dialog__add__title">注意</h2>
      <section class="dialog__add__body">
        <p class="p__event">确定要把"{{eventNamed}}"添加到待办事项吗？</p>
        
        <button class="button__close" @click="onclose">取消</button>
        <button class="button__confirm" @click="onconfirm">确定</button>
      </section>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.dialog__add{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  padding: 10vh 10vw;
  background-color: #ccc;
  &__title{
    font-size: 30px;
    color: #333;
  }
  &__body{
    padding: 5vh 0;
    .p__event{

    }
  }
}
.button{
  &__close{
    background-color: red;
    color: #fff;
  }
  &__confirm{
    background-color: chartreuse;
    color: #fff;
  }
}
</style>
