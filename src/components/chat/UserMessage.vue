<script lang="ts" setup>
const props = withDefaults(defineProps<{
  data: Chat.ChatMessage
  status: Chat.ChatStatus
  canEdit: boolean
  isAnswering: boolean
  userAvatar?: string
}>(), {
  status: 'idle',
})

const emit = defineEmits(['editQuestion'])

const isEdit = ref(false)

function handleEditedQuestion(value: string) {
  emit('editQuestion', value)
  isEdit.value = false
}

watch(() => props.isAnswering, val => val && (isEdit.value = false))
</script>

<template>
  <div class="flex gap-4 items-start">
    <div
      class="bg-white bg-cover flex justify-center flex-shrink-0 overflow-hidden mr-4 w-10 h-10 rounded-[50%]"
      :style="userAvatar ? { backgroundImage: `url(${userAvatar})` } : {}"
    />
    <div class="group bg-bg-white flex-1">
      <EditableQuestion v-if="isEdit" :value="data.content" @submit="handleEditedQuestion" @cancel="isEdit = false" />
      <!-- 文本内容 -->
      <div v-else-if="data.content" class="user-message flex justify-between items-center mb-[20px] text-[15px]">
        <div class="message-container relative rounded-3 rounded-lt-0 p-4 min-h-14 leading-6 text-white bg-primary is-user dark:color-white inline-block">
          <div class="message-content break-words whitespace-pre-wrap text-left">
            {{ data.content }}
          </div>
        </div>
        <Tooltip v-if="canEdit && !isAnswering" content="修改问题" placement="top" effect="light">
          <div
            class="question-edit hidden group-hover:block text-[16px] color-primary bg-[#f0f5ff] dark:bg-bg-content cursor-pointer rounded-1 p-0.5"
            @click="isEdit = true"
          >
            <Icon icon="ant-design:edit-outlined" />
          </div>
        </Tooltip>
      </div>
      <!-- 图片或附件 -->
      <div v-if="data.attachment">
      <!--  -->
      </div>
    </div>
  </div>
</template>
