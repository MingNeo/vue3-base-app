import path from 'path'
import { defineConfig } from 'vite'
// import Preview from 'vite-plugin-vue-component-preview'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
// import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import type { ComponentResolver } from 'unplugin-vue-components/types'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'vite-plugin-vue-markdown'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import LinkAttributes from 'markdown-it-link-attributes'
import { viteMockServe } from 'vite-plugin-mock'
import Inspect from 'vite-plugin-inspect'
// import Inspector from 'vite-plugin-vue-inspector'
import Unocss from 'unocss/vite'
import Shiki from 'markdown-it-shiki'
import VueMacros from 'unplugin-vue-macros/vite'
import virtualHtml from 'vite-plugin-virtual-html'
import devServerConfig from '../../dev.server.config'

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

/**
 * 自定义一个插件来支持在markdown中直接使用demo标签来引用组件
 * @returns 
 */
function DemoSrcReplacementPlugin() {
  return {
    name: 'demo-src-replacement',
    transform(code, id) {
      if (id.endsWith('.md')) {
        // 检查是否是 demo 组件
        if (code.includes('<demo ')) {
          // 替换 demo 组件的 src 属性
          code = code.replace(/<demo([^>]*\s)src="(.*?)"([^>]*)>/g, (match, beforeSrc, oldSrc, afterSrc) => {
            // 处理不同格式的 src 属性值
            let newSrc = path.resolve(path.dirname(id), oldSrc);
            newSrc = newSrc.match(/(\/src.*)/)?.[1] || newSrc;
            return `<demo ${beforeSrc}src="${newSrc}"${afterSrc}>`;
          });
        }
      }
      return code;
    },
  };
};

export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, '../../src')}/`,
    },
  },

  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: path.resolve(__dirname, 'doc.html'),
  //     },
  //   },
  // },

  define: {
    'process.env': {
      BASE_API_URL: '',
      DISABLED_PERMISSSION: true,
    },
  },

  server: devServerConfig,

  plugins: [
    DemoSrcReplacementPlugin(),
    // Preview(),
    virtualHtml({
      pages: {
        index: '/docs/.config/doc.html',
      },
    }),
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
      extensions: ['md'],
      dirs: ['docs', 'src/components', {
        dir: 'src/composables',
        baseRoute: 'composables',
      }],
      exclude: ['**/components/**/children/**/*.md', '**/_*.md'],
      extendRoute: (route) => {
        let newRoute = route
        if (route.path === '/readme')
          // return { ...route, redirect: '/common/formitemsbuilder/readme' }
          return { ...route, name: 'Index', path: '/' }
        else 
          newRoute = { ...route, path: route.path.replace('/readme', '') }
        return newRoute
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({ 
      layoutsDirs: 'docs/.config/layouts',
      defaultLayout: 'doc'
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
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
      resolvers: [AntDesignVueResolver({ importStyle: 'less' }), IconParkResolver()],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      directoryAsNamespace: true,
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // 配置见 unocss.config.ts
    Unocss(),

    // https://github.com/antfu/vite-plugin-vue-markdown
    Markdown({
      wrapperClasses: 'prose prose-sm m-auto text-left',
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Shiki, {
          theme: 'one-dark-pro',
        })
        // md.use(require('markdown-it-vitepress-demo'))
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, '../../locales/**')],
    }),

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

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // charset: false,
        modifyVars: {
          'primary-color': '#007AFF',
          'border-color-base': '#D9D9D9',
          'border-radius-base': '4px',
          'card-radius': '8px',
          'modal-header-padding-vertical': '16px',
          'modal-header-padding-horizontal': '16px',
          'modal-body-padding': '16px',
          'pagination-item-bg': '#FAFAFA',
          'pagination-item-link-bg': '#FAFAFA',
          'pagination-item-bg-active': '#F0F7FF',
          'table-border-radius-base': '8px',
          'table-header-bg': '#F5F5F5',
          'table-row-hover-bg': '#F0F7FF',
          'table-selected-row-bg': '#F0F7FF',
          'table-border-color': '#F2F2F2',
          'table-header-cell-split-color': 'rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },

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
