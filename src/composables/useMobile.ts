/**
 * 判断是否是移动端
 */
export function useMobile() {
  const { isMobile } = useScreenSize()
  return isMobile
}
