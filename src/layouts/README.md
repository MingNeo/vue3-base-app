## Layouts

页面的布局文件
如不指定，则使用默认布局
使用[`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) 和 [`vite-plugin-vue-layouts`](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)，可以像这样在页面的SFC中指定布局：

```html
<route lang="yaml">
meta:
  layout: blank
</route>
```

当前默认使用basic布局，即包含左侧菜单等的layout