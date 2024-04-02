import path from 'path'
import { defineConfig } from 'vite'
// import Preview from 'vite-plugin-vue-component-preview'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
// import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type { ComponentResolver } from 'unplugin-vue-components/types'
import AutoImport from 'unplugin-auto-import/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import { viteMockServe } from 'vite-plugin-mock'
import Inspect from 'vite-plugin-inspect'
// import Inspector from 'vite-plugin-vue-inspector'
import Unocss from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
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

function SwiperResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^Swiper/))
        return { name, from: 'swiper/vue' }
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
    // Preview(),

    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.md$/],
          reactivityTransform: false, // 此实验性功能已被废弃，关闭 https://vuejs.org/guide/extras/reactivity-transform.html
        }),
      },
      defineProps: false,
      setupComponent: false,
      setupSFC: false,
      // singleDefine: false,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue'],
      exclude: ['**/components/*.vue', '**/pages/**/children/**/*.vue', '**/_*.vue'],
      extendRoute: (route) => {
        // Redirect from '/' to '/manage'
        // if (route.path === '/')
        //   return { ...route, redirect: 'manage' }

        return route
      },
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
        'vue/macros',
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
    // 为防止后续接受项目同学混乱，仅自动加载必须组件库
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

    // https://github.com/antfu/vite-plugin-inspect
    // 访问 http://localhost:3333/__inspect/ 可看到注入
    Inspect(),

    // https://github.com/webfansplz/vite-plugin-vue-inspector
    // Inspector({
    //   toggleButtonVisibility: command === 'serve' ? 'always' : 'never',
    // }),

    // https://github.com/vbenjs/vite-plugin-mock
    // 如需对接真实接口可把mock下接口改为/mock/api/xxx
    viteMockServe({
      mockPath: 'mock',
      localEnabled: command === 'serve',
    }),
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

  // vite-ssg这个包与antdv有冲突，会造成打包生产文件失败，如需使用可手工开启
  // https://github.com/antfu/vite-ssg
  // ssgOptions: {
  //   script: 'async',
  //   formatting: 'minify',
  //   onFinished() { generateSitemap() },
  // },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/],
  },
}))
