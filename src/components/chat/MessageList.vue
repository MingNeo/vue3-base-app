<script setup lang="ts">
import Message from './Message.vue'

const route = useRoute()
const { scrollRef, scrollToBottom } = useScrollToBottom()

const {
  currentChatData,
  currentChatInfo,
  prompt,
  startNewChat,
  startNewQuestion,
  startByHistory,
  submitTextAndStart,
  regenerateMessage,
  editQuestion,
  answerStatus,
  cancelChatFetch,
} = useChat({ scrollToBottom, fetchOptions: { url: '/v1/qa', regenerateMethod: 'put' } })

const chatStore = useChatStore()

const isShare = computed(() => route.query.share === '1')
const isNewChatStarted = ref(false)
const loading = ref(false)
const withSearch = ref(false)

async function loadChat(chatId = route.params?.id as string) {
  const llmType = route.query.llmType as string | undefined
  if (chatId === 'new') {
    loading.value = true
    const { text: content, files, withSearch: _withSearch } = chatStore.chatDataFromWorkbench || {}
    withSearch.value = _withSearch
    const type: Chat.Type = 'plain_text'

    startNewChat({ files, type, content, llmType, withSearch: _withSearch })
    isNewChatStarted.value = true
  }
  else {
    if (!isNewChatStarted.value) {
      loading.value = true
      const chat = await startByHistory({ chatId, isShare: isShare.value, llmType })
      withSearch.value = chat?.data[chat?.data?.length - 1]?.withSearch ?? withSearch.value
    }

    isNewChatStarted.value = false
  }

  setTimeout(() => {
    loading.value = false
  }, 1000)
}

function handleSubmit({ content, files, type, withSearch }: { content?: string, files?: any[], type?: Chat.Type, withSearch?: boolean }) {
  if ((content && content.trim() !== '') || files?.length) {
    submitTextAndStart({ content, files, type, withSearch })
  }
}

function handleCancel() {
  cancelChatFetch()
}

onMounted(() => {
  loadChat()
})

async function handleEditQuestion(questionId: string, text: string) {
  await editQuestion(questionId, withSearch.value, text)
}

function handleReported(messageId: string) {
  chatStore.updateChatMessage(currentChatInfo.value.id, messageId, { isFeedback: true })
}
</script>

<template>
  <div ref="scrollRef" class="content flex-1 mb-5 w-full">
    <template v-for="(item, i) in currentChatData" :key="item.id">
      <UserMessage v-if="item?.role === 'user'" />
      <Message
        v-else
        :data="item"
        :status="answerStatus"
        :is-last-question="i === currentChatData.length - 2"
        :is-last="i === currentChatData.length - 1"
        :is-share="isShare"
        :current-chat-info="currentChatInfo"
        :with-search="withSearch"
        @regenerate="regenerateMessage(item.questionId as string, withSearch)"
        @edit-question="val => handleEditQuestion(item.questionId as string, val)"
        @reported="handleReported(item.id)"
        @scroll-to-bottom="scrollToBottom"
      />
    </template>
  </div>

  <div v-if="!isShare" class="mb-5">
    <Textarea
      v-model="prompt"
      v-model:with-search="withSearch"
      :with-reasoning="currentChatInfo.llmType === 'deepseekr1'"
      :llm-type="currentChatInfo.llmType"
      :status="answerStatus"
      :data="currentChatData"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
