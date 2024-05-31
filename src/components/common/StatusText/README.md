# StatusText
状态文本显示组件。可以根据不同的状态在UI中显示不同的颜色和文本。

<demo src="./demos/demo.vue" />

## 使用方法
```vue
<script lang="ts" setup>
import StatusText from '~/components/StatusText.vue'

const statusConfig = reactive({
  ready: {
    text: '准备就绪',
    color: '#4CAF50',
  },
  error: {
    text: '错误',
    color: '#F44336',
  },
  warning: {
    text: '警告',
    color: '#FFC107',
  },
})
</script>

<template>
  <div>
    <StatusText :config="statusConfig" status="ready" />
  </div>
</template>
```

## API清单

### Props

| 名称   | 类型                     | 默认值 | 描述                                                         |
| ------ | ------------------------ | ------ | ------------------------------------------------------------ |
| config | Record<string, any> | -   | 每种状态的配置对象，键代表状态的名称，每个值都包含文本和颜色两个属性。 |
| status | string             | -   | 要渲染的状态名称。                                           |

### slot
自定义渲染文本内容
```vue
<StatusText :config="statusConfig" status="ready">
{{ text }}
</StatusText>
```
