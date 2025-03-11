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
}

export default defineConfig({
  shortcuts: [
    ['btn', 'py-1 px-4 text-[14px] leading-[14px] rounded-[6px] border border-[#ddd] border-solid cursor-pointer transition text-gray-600 disabled:opacity-60 disabled:!cursor-not-allowed hover:[&:not(:disabled)]:text-primary hover:[&:not(:disabled)]:border-primary active:[&:not(:disabled)]:scale-95'],
    ['btn-plain', 'py-2 px-4 text-[14px] leading-[14px] rounded-[6px] border border-transparent border-solid cursor-pointer transition bg-[#eee] dark:bg-[#ffffff0d] dark:border-transparent disabled:opacity-60 disabled:!cursor-not-allowed hover:[&:not(:disabled)]:text-white hover:[&:not(:disabled)]:bg-primary/80 hover:[&:not(:disabled)]:border-primary active:[&:not(:disabled)]:scale-95'],
  ],
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
    ['safe-pt', { 'padding-top': `env(safe-area-inset-top)` }],
    ['safe-pb', { 'padding-bottom': `env(safe-area-inset-bottom)` }],
    ['safe-mt', { 'margin-top': `env(safe-area-inset-top)` }],
    ['safe-mb', { 'margin-bottom': `env(safe-area-inset-bottom)` }],
    [/^safe-pt-(\d)$/, ([, d]) => ({ 'padding-top': `calc(env(safe-area-inset-top) + ${+d * 0.25}rem)` }), { layer: 'utilities' }], // 不兼容iOS < 11.2
    [/^safe-pb-(\d)$/, ([, d]) => ({ 'padding-bottom': `calc(env(safe-area-inset-bottom) + ${+d * 0.25}rem)` }), { layer: 'utilities' }], // 不兼容iOS < 11.2
    [/^safe-mt-(\d)$/, ([, d]) => ({ 'margin-top': `calc(env(safe-area-inset-top) + ${+d * 0.25}rem)` }), { layer: 'utilities' }], // 不兼容iOS < 11.2
    [/^safe-mb-(\d)$/, ([, d]) => ({ 'margin-bottom': `calc(env(safe-area-inset-bottom) + ${+d * 0.25}rem)` }), { layer: 'utilities' }], // 不兼容iOS < 11.2
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
