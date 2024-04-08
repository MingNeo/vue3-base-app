import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
// import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type { ComponentResolver } from 'unplugin-vue-components/types'
import AutoImport from 'unplugin-auto-import/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import { viteMockServe } from 'vite-plugin-mock'
import Unocss from 'unocss/vite'
import devServerConfig from './dev.server.config'

function IconParkResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^IconPark/))
        return { name: name.replace('IconPark', ''), from: '@icon-park/vue-next' }
      if (name.match(/^icon-park/))
        return { name: name.replace('icon-park-', ''), from: '@icon-park/vue-next' }
    },
  }
}

export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  define: {
    'process.env': {
      BASE_API_URL: '',
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
    Layouts({ defaultLayout: 'basic' }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables/**/*.ts',
        'src/stores',
        'src/utils',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [ElementPlusResolver(), IconParkResolver()],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      directoryAsNamespace: true,
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // 配置见 unocss.config.ts
    Unocss(),

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
      localEnabled: command === 'serve',
    }),
    Vue(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts', 'src/**/test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
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
