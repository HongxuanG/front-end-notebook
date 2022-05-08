import { onMounted, onUnmounted, ref } from 'vue'
export const useMouseMove = () => {
  const x = ref(0)
  const y = ref(0)

  function handleMouseMove(e: MouseEvent) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
  })
  onUnmounted(() => {
    console.log('unmounted')
    window.removeEventListener('mousemove', handleMouseMove)
  })
  return {
    x,
    y,
  }
}
