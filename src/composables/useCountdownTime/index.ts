import { ref, watch } from 'vue'

export default function useCountdownTime(time: number, callback?: () => void) {
  const current = ref(time)
  const isCounting = ref(false)

  let timer: number | undefined

  const stop = () => {
    window.clearInterval(timer)
    current.value = 0
    isCounting.value = false
  }

  const start = () => {
    if (typeof window !== 'undefined') {
      current.value = time
      isCounting.value = true
      timer = window.setInterval(() => {
        current.value -= 1
        if (current.value <= 0) {
          stop()
          callback?.()
        }
      }, 1000)
    }
  }

  onUnmounted(stop)

  const formattedTime = computed(() => formatTime(current.value))

  watch(current, (val) => {
    if (val === 0)
      stop()
  })

  return { start, stop, current, formattedTime, isCounting }
}

function formatTime(time: number): string {
  return `${String(time).padStart(2, '0')}`
}
