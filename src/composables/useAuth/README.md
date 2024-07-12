# useAuth
用于检查用户是否有特定权限。
主要用于需要在script中判断权限的情况, 通常情况下可直接在模版中使用$hasAuth而无需此hook

## 使用方法

```typescript
<template>
  <div v-if="hasAuth('xxxx:edit')">您有编辑权限</div>
  <div v-else>对不起，您没有编辑权限</div>
</template>

<script lang="ts" setup>
const hasAuth = useAuth()
</script>
```
