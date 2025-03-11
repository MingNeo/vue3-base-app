import { useBreakpoints } from '@vueuse/core'

/**
 * 屏幕尺寸, 通常用于js判断
 * unocss中直接使用如md:text-2xl来编写指定屏幕尺寸的样式，max-md:text-xl来编写md以下屏幕尺寸的样式
 */
export function useScreenSize() {
  const breakpoints = useBreakpoints({
    // 小屏手机
    'xs': 414,
    // 大屏手机
    'sm': 640,
    // 平板
    'md': 768,
    // 桌面
    'lg': 1024,
    // 大桌面
    'xl': 1280,
    // 超大桌面
    '2xl': 1536,
  })

  const activeBreakpoint = breakpoints.active()
  const isMobile = computed(() => breakpoints.smaller('lg').value)
  return { ...breakpoints, screenSize: activeBreakpoint, isMobile }
}
