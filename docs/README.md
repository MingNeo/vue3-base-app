# Admin 基础工程
本工程在通用基础工程基础上，内置了后台管理系统的常用功能及基础组件，方便快速开发后台管理应用。

## 特性

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [esbuild](https://github.com/evanw/esbuild) - 就是快！
- 🗂 [基于文件的路由](./src/pages)
- 📦 [组件自动化加载](./src/components)
- 🍍 [使用 Pinia 的状态管理](https://pinia.vuejs.org)
- 📑 [布局系统](./src/layouts)
- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎
- 🌍 [I18n 国际化开箱即用](./locales)
- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)
- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入
- 🦔 使用 [critters](https://github.com/GoogleChromeLabs/critters) 的生成关键 CSS
- 🦾 TypeScript
- ⚙️ 使用 [Vitest](https://github.com/vitest-dev/vitest) 进行单元测试, [Cypress](https://cypress.io/) 进行 E2E 测试
- ⚙️ 使用 [Storybook](https://storybook.js.org/) 进行可视化调试与预览

## 使用

### 查看组件文档/事例
```bash
pnpm doc:dev
```

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

`~/`被别名为`./src/`文件夹。

### 自动import

自动导入无需手工引入以下模块
库

- vue
- vue-router
- vueuse
- vue-i18n
- antdv
- icon-park

自动导入无需手工引入以下项目目录下文件

- composables
- stores
- utils
- components

自动导入及注册components目录下组件,无需手工引入, 根据文件目录生成组件名，如components/common/HelloWord.vue可直接在
template中使用`<CommonHelloWord />` 或 `<common-hello-word />`

具体可参见自动生成的src/auto-imports.d.ts

### 路由

src/pages目录下的vue文件将自动生成路由。
该目录下的各页面目录内children、components下的文件将不会生成路由。
有关更多详细信息，请查看[`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages)。

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
<el-button v-if="$hasAuth('demoList:del')">
Button
</el-button>
```

or

```js
const hasAuth = useAuth()
hasAuth('demoList:del')
```

### 图标

使用IconPark官方图标：直接使用IconPark开头跟上对应图标，无需手工引入
如使用buy图标

```vue
<IconParkBuy />

<icon-park-buy />
```

使用项目图标

```vue
<common-icon type="arrow-left" size="16" />
```

### mock

mock目录下的文件将自动生成mock，当本地开发且未转发时可自动使用mock

### 组件开发调试预览

内置Storybook
