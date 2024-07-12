import {
  defineConfig,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const themeColors: Record<string, any> = {
  'primary': 'var(--primary-color)',
  'bg-white': 'var(--bg-color-white)',
  'bg-content': 'var(--content-background)',
  'bg-active': 'var(--background-active)',
  'active': 'var(--active-color)',
  'text-black': 'var(--text-color)',
  'grey': 'var(--text-color-grey)',
  'border-grey': 'var(--text-color-grey)',
}

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno(),
    presetTypography(),
  ],
  theme: {
    colors: themeColors,
  },
  rules: [
    ['xy-center', { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }],
    ['flex-center', { 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }],
    ['transition', { 'transition-property': 'all', 'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)', 'transition-duration': '150ms' }],
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
