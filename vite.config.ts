import type { ComponentResolver } from 'unplugin-vue-components/types'
import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
// import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import svgLoader from 'vite-svg-loader'
import devServerConfig from './dev.server.config'

function IconResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'Icon' || name === 'Iconify')
        return { name: 'Icon', from: '@iconify/vue' }
    },
  }
}

const ENABLE_CDN = false
const CDN_PATH = ''

export default defineConfig(({ command }) => ({
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
      '@/assets/': command === 'serve' || !ENABLE_CDN ? `${path.resolve(__dirname, 'src/assets')}/` : `${CDN_PATH}/assets/`,
    },
  },

  server: devServerConfig,

  plugins: [
    VueRouter({
      exclude: ['**/components/*.vue', '**/pages/**/children/**/*.vue', '**/_*.vue'],
      //   extendRoute: async (route) => {
      //     // Redirect from '/' to '/manage'
      //     // if (route.path === '/')
      //     //   return { ...route, redirect: 'manage' }
      //     return route
      //   },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      resolvers: [
        VantResolver(),
      ],
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        // '@unhead/vue',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables/**/*.ts',
        'src/stores',
        'src/utils',
        'src/config',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [
        // ElementPlusResolver(),
        IconsResolver({
          prefix: 'icon',
          customCollections: ['local'],
        }),
        IconResolver(),
        VantResolver(),
      ],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      directoryAsNamespace: true,
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // 配置见 unocss.config.ts
    Unocss(),

    Icons({
      autoInstall: false,
      customCollections: {
        local: FileSystemIconLoader(
          './src/assets/icons',
          svg => svg.replace(/^<svg /, '<svg fill="currentColor" '),
        ),
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/vbenjs/vite-plugin-mock
    // 如需对接真实接口可把mock下接口改为/mock/api/xxx
    viteMockServe({
      mockPath: 'mock',
      enable: command === 'serve',
    }),

    svgLoader(),

    Vue(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts', 'src/**/test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse'],
    },
  },

  // css: {
  //   preprocessorOptions: {},
  // },

  // vite-ssg如需使用可手工开启
  // https://github.com/antfu/vite-ssg
  // ssgOptions: {
  //   script: 'async',
  //   formatting: 'minify',
  //   onFinished() { generateSitemap() },
  // },

  ssr: {
    noExternal: ['workbox-window', /vue-i18n/],
  },
}))
