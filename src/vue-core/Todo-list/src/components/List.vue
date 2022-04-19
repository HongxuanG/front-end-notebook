<script setup lang='ts'>
import { useSlots } from 'vue';
const slot = useSlots()
</script>

<template>
  
  <div class="result-list">
    <slot></slot>
  </div>
</template>

<style scoped>
.result-list{

}
</style>
