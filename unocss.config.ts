import {
  defineConfig,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno(),
    presetTypography(),
  ],
  rules: [
    [/^(width|height|top|left|right|bottom)(\d+)$/, ([,name, d]) => ({ [name]: `${d}px` })],
    [/^fs\-?(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^frs\-?(\d+)$/, ([, d]) => ({ 'font-size': `${+d / 75}rem` })],
    [/^fvs\-?(\d+)$/, ([, d]) => ({ 'font-size': `${+d / 10}vw` })],
    [/^lh\-?(\d+)$/, ([, d]) => ({ 'line-height': `${d}px` })],
    [/^gap\-?(\d+)$/, ([, d]) => ({ gap: `${d}px` })],
    [/^radius\-?(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],
    [/^(margin|padding)\-?([trblvh]?)(\d+)$/, ([,name, p, d]) => {
      const nameObject: { [props: string]: string[] } = {
        t: ['-top'],
        l: ['-left'],
        r: ['-right'],
        b: ['-bottom'],
        v: ['-top', '-bottom'],
        h: ['-left', '-right'],
      }
      const rs: { [props: string]: string } = {};
      (nameObject[p] || ['']).forEach((pos: string) => {
        rs[`${name}${pos}`] = `${d}px`
      })

      return rs
    }],
    [/^p\-v\-(\d+)(px)?$/, ([, d]) => ({ 'padding-top': `${d}px`, 'padding-bottom': `${d}px` })],
    [/^p\-h\-(\d+)(px)?$/, ([, d]) => ({ 'padding-left': `${d}px`, 'padding-right': `${d}px` })],
    [/^m\-v\-(\d+)(px)?$/, ([, d]) => ({ 'margin-top': `${d}px`, 'margin-bottom': `${d}px` })],
    [/^m\-h\-(\d+)(px)?$/, ([, d]) => ({ 'margin-left': `${d}px`, 'margin-right': `${d}px` })],
    ['h-v-center', { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }],
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
