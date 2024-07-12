export default function useDarkMode() {
  const isDark = useDark({
    selector: 'html',
    valueDark: 'dark',
    valueLight: 'light',
  })

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return {
    isDark,
    toggleDarkMode,
  }
}
