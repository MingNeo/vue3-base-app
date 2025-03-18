# Vue3 + Vite基础工程
本工程在通用基础工程基础上，内置了常用功能及基础组件，方便快速开发应用。

本分支是mobile优先，集成vant组件库

## 特性

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [esbuild](https://github.com/evanw/esbuild)
- 🗂 [基于文件的路由](./src/pages)
- 📦 [组件自动化加载](./src/components)
- 🍍 [使用 Pinia 的状态管理](https://pinia.vuejs.org)
- 📑 [布局系统](./src/layouts)
- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎
- 🌍 [I18n 国际化](./locales)
- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - Composition 等API 自动引入
- 🖨 使用 [vite-ssg](https://github.com/antfu/vite-ssg) 进行服务端生成 (SSG), 需手工开启
- ⚙️ 使用 [Vitest](https://github.com/vitest-dev/vitest) 进行单元测试, [Cypress](https://cypress.io/) 进行 E2E 测试
- ⚙️ 使用 [Storybook](https://storybook.js.org/) 进行可视化调试与预览

<br>

## 使用
### 开发

推荐使用pnpm

```bash
pnpm install
```

本地服务 http://localhost:3333

```bash
pnpm dev
```

### 构建

构建该应用只需要执行以下命令

```bash
pnpm build
```

然后你会看到用于发布的 `dist` 文件夹被生成。

### 路径别名

`@/`被别名为`./src/`文件夹。

### 自动import

自动导入无需手工引入以下模块
库

- vue
- vue-router
- vueuse
- vue-i18n
- icon-park

自动导入无需手工引入以下项目目录下文件

- composables
- stores
- utils
- components

自动导入无需引入及注册以下目录下组件,根据文件目录生成组件名，如components/common/HelloWord.vue可直接在
template中使用<CommonHelloWord /> 或 <common-hello-word />

具体可参见自动生成的src/auto-imports.d.ts

### 路由

src/pages目录下的vue文件将自动生成路由。
该目录下的各页面目录内children、components下的文件将不会生成路由。

### layout
页面的布局文件
如不指定，则使用默认布局。
可以像这样在页面的SFC中指定布局：

```vue
<route lang="yaml">
meta:
  layout: basic
</route>

<template>
  ...
</template>
```

- 默认：空布局
- basic：包含顶栏、左侧菜单的layout

### 权限控制

#### 1、页面级权限控制

在页面组件中配置role、permission

```vue
<route lang="yaml">
meta:
  role: [admin]
</route>
```

#### 2、菜单权限控制

同页面级权限控制，根据路由path自动生成。可通过变量generateMenuByAuth控制是否开启

#### 3、按钮级权限控制

```vue
<button v-if="$hasAuth('demoList:del')">
Button
</button>
```

or

```js
const hasAuth = useAuth()
hasAuth('demoList:del')
```

### 登录拦截

在src/modules/permission.ts中配置登录拦截路由白名单，未在白名单且校验无权限的页面，会跳转至登录页面。

```js
const whiteList = [
  '/login',
  '/register',
]
```

接口请求拦截器在src/utils/request.ts中配置， 可在unLoginHandler中配置未登录时跳转的页面。

```ts
export function unLoginHandler(errorMessage: string) {
  // ...
  router.push('/login')
}
```

### 图标
使用 [@iconify/vue](https://iconify.design/docs/icon-components/vue/)
以及[unplugin-icons](https://github.com/antfu/unplugin-icons)

```vue
<!-- 无需安装图标包，可以直接使用@iconify/vue的所有图标，使用哪个图标直接远程获取并自动缓存 -->
<!-- 可以在 https://icon-sets.iconify.design/ 右上角搜索图标 -->
<icon icon="icon-park-outline:back" class="text-red-500 w-10 h-10" />
```
#### 本地图标使用方式1

```vue
<!-- 本地图标使用unplugin-icons，在src/assets/icons目录下放置svg文件即可 -->
<!-- 如src/assets/icons/warning.svg ，用法为: 'icon-local-' + 文件名 -->
<icon-local-warning />

<!-- or -->
<IconLocalWarning />
```

#### 本地图标使用方式2
可在src/assets/icons/iconify.json中配置。
如上传至iconfont，并配合(tampermonkey-iconfont-iconify油猴插件)[https://github.com/yee94/tampermonkey-iconfont-iconify]插件直接下载iconify.json文件覆盖即可。
然后如下使用：
<icon icon="local:back" class="text-red-500 w-10 h-10" />

### Mock

`/mock`目录下的文件将自动生成mock，当本地开发且未转发对应api时可自动使用mock

### 组件预览

内置Storybook, 在stories目录下配置story文件。运行pnpm run storybook即可查看

### test

在test目录下配置单测脚本即可

### 响应式开发

项目内置了常用的断点配置:

- xs: 414px (小屏手机)
- sm: 640px (大屏手机)
- md: 768px (平板)
- lg: 1024px (桌面)
- xl: 1280px (大桌面)
- 2xl: 1536px (超大桌面)

可以使用 `useScreenSize` 在组件中判断屏幕尺寸。

```vue
<script setup lang="ts">
const { screenSize, isMobile } = useScreenSize()
</script>
```

注：css样式中，使用unocss的断点配置即可，如：

```html
<!-- 大于640px -->
<div class="sm:w-[500px]">hello</div>
<!-- 小于640px -->
<div class="max-sm:w-full">hello</div>
```

### 移动端安全区适配

iPhone X 等机型有胶囊、底部指示条等，需要针对这些机型进行安全区适配。

可以开启相关适配

```html
<!-- 在 head 标签中添加 meta 标签，并设置 viewport-fit=cover 值 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
/>
```

使用MobileSafeContainer容器包裹内容即可

```vue
<MobileSafeContainer top bottom class="xxx">
  <div>内容</div>
</MobileSafeContainer>
```

或使用本工程提供的的`safe-pt、safe-pb、safe-mt、safe-mb、safe-pt-*、safe-pb-*、safe-mt-*、safe-mb-*`类名

```html
<div class="safe-pt">内容</div>
<div class="safe-pt-2">内容</div>
```

等同于

```css
.safe-pt {
  padding-top: env(safe-area-inset-top);
}
.safe-pt-2 {
  padding-top: calc(env(safe-area-inset-top) + 2rem);
}
```
