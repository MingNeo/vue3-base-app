<script lang="ts" setup>
import Content from './Content.vue'
import ReasoningContent from './ReasoningContent.vue'
// import ResultLoading from './ResultLoading.vue'
import StepLoading from './StepLoading.vue'
import Toolbar from './Toolbar.vue'
import UserMessage from './UserMessage.vue'

const props = withDefaults(defineProps<{
  data: Chat.ChatMessage
  status: Chat.ChatStatus
  isLast: boolean
  isLastQuestion: boolean
  isShare: boolean
  currentChatInfo: Partial<Chat.ChatConversation>
  withSearch: boolean
  avatar?: string
}>(), {
  status: 'idle',
  isLast: false,
  currentChatInfo: () => ({}),
})

const emit = defineEmits(['regenerate', 'reported', 'scrollToBottom', 'messageClick'])

const isEdit = ref(false)
const isLoading = computed(() => props.isLast && ['fetching', 'searching'].includes(props.status))
const isInStreamProgress = computed(() => ['fetching', 'parsing', 'analyzing', 'outputting'].includes(props.status))
const isUser = computed(() => props.data?.role === 'user')
const suggests = computed(() => (props.currentChatInfo?.suggests || []).slice(0, 3))

watch(() => isInStreamProgress.value, (val) => {
  if (val)
    isEdit.value = false
})
</script>

<template>
  <div class="message">
    <div class="flex-1">
      <UserMessage v-if="isUser" :data="data" :status="status" :can-edit="isLastQuestion" :is-answering="isInStreamProgress" />

      <template v-else>
        <StepLoading v-if="data.type === 'document' && isLast && !data.isHistory" :status="status" />

        <div class="message-container flex justify-between items-center text-[14px] dark:bg-bg-content mb-5">
          <div class="message-content text-left">
            <CommonLoadingBar v-if="isLoading" class="h-10 inline-block max-w-[140px] text-[#333]! dark:text-[#999]!">
              <template #right>
                <span>{{ data.withSearch ? '联网搜索中' : '分析中' }}</span>
              </template>
            </CommonLoadingBar>
            <div v-if="!isLoading" class="w-full">
              <!-- <ResultLoading v-if="data.content" :with-search="!!data.withSearch" :keywords="data.searchResult?.keywords" :links="data.searchResult?.links" /> -->
              <ReasoningContent v-if="data.reasoning_content" :content="data.reasoning_content" />
              <Content
                :class="data?.role === 'user' ? 'text-white' : 'text-black'"
                :content="data.content" :status="status"
                :show-cursor="isLast && isInStreamProgress"
                @click="emit('messageClick')"
              />
            </div>
          </div>
          <Toolbar
            v-if="!isShare && !isInStreamProgress"
            :is-last="isLast" :data="data" :chat-id="currentChatInfo.id" :status="status"
            @regenerate="() => emit('regenerate')" @reported="() => emit('reported')"
          />
        </div>
      </template>

      <template v-if="!isShare && isLast && !isUser">
        <!-- 推荐词 -->
        <Suggests
          v-if="!data.isHistory && !isInStreamProgress"
          :loading="status === 'summarizing' && !suggests?.length"
          :suggests="suggests"
        />

        <div v-if="data.isHistory" class="flex w-full items-center text-sm text-gray-500 before:h-px before:flex-1 before:bg-gray-200 before:content-[''] after:h-px after:flex-1 after:bg-gray-200 after:content-[''] dark:text-gray-400 dark:before:bg-gray-700 dark:after:bg-gray-700">
          继续会话
        </div>
      </template>
    </div>
  </div>
</template>
