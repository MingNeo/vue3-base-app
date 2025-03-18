import { ref, watchEffect } from 'vue'

export function useTypingText(text: string, { speed = 150, loop = false, delay }: { speed?: number, loop?: boolean, delay?: number } = {}) {
  const displayedText = ref('')
  const index = ref(0)

  watchEffect((onCleanup) => {
    if (index.value < text.length) {
      const timeout = setTimeout(() => {
        displayedText.value += text[index.value]
        index.value += 1
      }, speed)

      onCleanup(() => clearTimeout(timeout))
    }
    else if (loop) {
      const timeout = setTimeout(() => {
        displayedText.value = ''
        index.value = 0
      }, delay ?? speed)

      onCleanup(() => clearTimeout(timeout))
    }
  })

  return displayedText
}
