<template>
  <h1>Effect: {{ count }}</h1>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
const count = ref(0)
// 监听副作用函数
watchEffect(() => {
  console.log(count.value)
})
setTimeout(() => {
  count.value++
}, 1000)
</script>

<style scoped></style>
