# useRequest文档

## 简介
`useRequest`是一个Vue composable，用于实现在组件中发起请求，并提供了loading等功能。

## 使用方法
``` ts
useRequest(fetchFn, options)
```

```typescript
import useRequest from 'useRequest'

// 定义请求方法，比如：
function fetchFn(id: number) {
  return axios.get(`/api/user/${id}`)
}

export default {
  setup() {
    const { data, execute, isLoading } = useRequest(fetchFn)

    // 默认情况下加载该hook时就会自动触发请求，也可通过调用execute主动发起请求
    const getUser = async (id) => {
      await execute(id)
    }

    return {
      data,
      isLoading
    }
  }
}
```

请求返回数据的几种处理方法

1、直接使用hook的data
```vue
<script setup>
const { data, execute, isLoading } = useRequest(fetchFn)
</script>

<template>
  <div>{{ data }}</div>
</template>
```

2、execute的返回值
```vue
<script setup>
const { execute, isLoading } = useRequest(fetchFn)

execute().then((result) => {})
</script>
```

3、使用then方法。初始化自动请求的情况下，如不想使用data而是手工处理返回值，可以使用该方法
```vue
<script setup>
const { then } = useRequest(fetchFn)

then((result) => {}, error => console.log(error))
</script>
```
## API
### 参数
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fetchFn | 请求的函数 | `(...args: any[]) => Promise<any>` | - |
| options.immediate | 在组件加载后是否自动触发请求 | boolean | true |
| options.shallow | 是否使用shallowRef | boolean | true |
| options.onError | 错误回调函数 | function | undefined |
| options.onSuccess | 成功回调函数 | function | undefined |

### Return
| 属性 | 说明 | 类型 |
| --- | --- | --- |
| data | 请求的数据 | `Ref<T \| undefined>` |
| error | 请求的错误信息 | `ShallowRef<unknown \| undefined>` |
| isFinished | 请求是否完成 | `Ref<boolean>` |
| isLoading | 请求是否在加载中 | `Ref<boolean>` |
| execute | 手动触发请求的函数 | `(...args: any) => PromiseLike<UseRequestReturn<T>>` |
| then | 请求加载后回调 | `(onFulfilled, onRejected) => PromiseLike<UseRequestReturn<T>>` |
| cancel | 中断请求 | `() => void` |
