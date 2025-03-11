import type { Ref } from 'vue'

/**
 * 移动端输入框处理。软键盘弹出自动进入可视区域等
 * TODO: 未充分测试，待完善
 */
export default function useMobileInput({ inputRef, inputArea, onEnter }: {
  inputRef: Ref<null | HTMLInputElement | HTMLTextAreaElement>
  inputArea?: Ref<null | HTMLDivElement>
  onEnter?: () => void
}) {
  const isMobile = useMobile()
  const isIos = computed(() => /iPad|iPhone|iPod/.test(navigator.userAgent))
  const isAndroid = computed(() => navigator.userAgent.includes('Android'))

  // 获取视口尺寸
  const getViewportHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

  const originHeight = getViewportHeight()
  const isSoftKeyboardShow = ref(false)

  function onFocus() {
    if (isMobile.value && document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName.toUpperCase())) {
      isSoftKeyboardShow.value = true
      setTimeout(() => {
        if (isIos.value) {
          const version = navigator.appVersion.match(/OS (\d+)_(\d+)(?:_(\d+))?/)
          if (version && version[1] === '11' && version[2] === '0') {
            inputRef.value?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest', // 防止水平方向偏移
            })
          }
          // iOS 11.0～11.3 操作 scrollTop 或者 scrollIntoView 有 bug，会把页面滚动到页面顶部
          // if (!/OS 11_[0-3]\D/.test(navigator.userAgent)) {
          //   document.documentElement?.scrollTo({
          //     top: document.documentElement.scrollHeight,
          //     behavior: 'smooth',
          //   })
          // }
        }
        else if (isSoftKeyboardShow.value) {
          document.activeElement?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }, 300)
    }
  }

  // 判断元素是否在视窗内
  // function isInViewPort() {
  //   if (!inputRef?.value)
  //     return false

  //   const height = getViewportHeight()
  //   const { top, bottom } = inputRef.value.getBoundingClientRect()

  //   return top >= 0 && bottom <= height
  // }

  function onKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.ctrlKey) {
      event.preventDefault()
      onEnter?.()
    }
  }

  onClickOutside(inputArea ?? inputRef, () => {
    isSoftKeyboardShow.value = false
  })

  function onBlur() {
    isSoftKeyboardShow.value = false
  }

  watch(isSoftKeyboardShow, (newVal, oldVal) => {
    if (oldVal && !newVal)
      onBlur()
  })

  const onResize = () => {
    const diff = originHeight - getViewportHeight()
    isSoftKeyboardShow.value = diff > 10
  }

  onMounted(() => {
    if (isAndroid.value) {
      window.addEventListener('resize', onResize)
    }
  })
  onUnmounted(() => {
    if (isAndroid.value) {
      window.removeEventListener('resize', onResize)
    }
  })

  return {
    isSoftKeyboardShow, // 是否软键盘已弹出

    // Safari 下textarea中 touchmove 默认会触发下拉刷新
    onTouchMove: (e: Event) => {
      e.stopPropagation()
    },

    onFocus,
    onKeypress,
    onBlur,
  }
}
