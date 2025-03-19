import { getChatDetail } from '@/api/chat'
import { defineStore } from 'pinia'

type ChatId = Chat.ChatMessage['id']

function createNewChatData(llmType: string = DEFAULT_LLMTYPE) {
  return { id: `new-${uuid()}`, data: [], status: 'idle', llmType, cacheModels: {} } as Chat.ChatConversation
}

function defaultState(): Chat.ChatState {
  const newChatData = createNewChatData()
  return {
    activeId: newChatData.id,
    chat: {
      [newChatData.id]: newChatData,
    },
  }
}

export const useChatStore = defineStore('chatStore', () => {
  const state = reactive<Chat.ChatState>(defaultState())
  const currentChat = computed(() => state.activeId ? state.chat[state.activeId] : undefined)
  const currentMessagesMap = computed(() => {
    return currentChat.value?.data?.reduce((acc, item) => ({ ...acc, [item.id]: item }), {} as Record<string, Chat.ChatMessage>) ?? {}
  })

  const router = useRouter()

  /**
   * 更新会话信息，不传id则默认为更新当前会话
   */
  function updateChat(payload: Partial<Chat.ChatConversation>) {
    const id = payload.id ?? state.activeId
    state.chat[id] = { ...state.chat[id], ...payload }
  }

  /**
   * 新增一个会话
   */
  async function addNewChat(llmType?: string) {
    const newChatData = createNewChatData(llmType)
    state.chat[newChatData.id] = newChatData
    state.activeId = newChatData.id
  }

  /**
   * 更新当前会话id，用于提问第一次返回答案时将当前会话id改为新会话id
   */
  async function updateActiveChatId(id: string) {
    const currentActive = state.activeId
    // 如果是新会话，将新会话的id改为当前会话的id
    if (`${currentActive}`.indexOf('new') === 0 && state.chat[currentActive]) {
      state.chat[id] = { ...state.chat[currentActive], id }
      Reflect.deleteProperty(state.chat, currentActive)
    }
    state.activeId = id
    // TODO: 是否也同时更新当前会话标题（看后端）

    return await reloadRoute(id)
  }

  /**
   * 同步聊天记录，用于恢复历史会话、刷新页面
   */
  async function syncChat({ chatId, llmType = DEFAULT_LLMTYPE, isShare, ...chatData }: { chatId: ChatId, llmType?: string, isShare?: boolean, [x: string]: any }) {
    try {
      const { data, suggests, type } = await getChatDetail(chatId, llmType, isShare)
      state.chat[chatId] = { ...chatData, id: chatId, data, suggests, llmType, type }
      state.activeId = chatId
      return state.chat[chatId]
    }
    catch (err) {
      console.error(err)
    }
  }

  function addChatMessage(id: ChatId, chat: Chat.ChatMessage) {
    if (!id)
      return
    state.chat[id].data = state.chat[id].data.filter(item => item.id !== chat.id)
    state.chat[id].data.push(chat)
  }

  function updateChatMessage(id: ChatId, messageId: string, chat: Partial<Chat.ChatMessage>, isMerge?: boolean): void

  function updateChatMessage(id: ChatId, messageId: string, chat: Chat.ChatMessage | Partial<Chat.ChatMessage>, isMerge = true) {
    if (!id)
      return
    const messageIndex = state.chat[id]?.data?.findIndex(item => item.id === messageId)
    if (messageIndex === -1)
      return
    state.chat[id].data[messageIndex] = isMerge ? { ...state.chat[id].data[messageIndex], ...chat } : { id: messageId, ...chat }
  }

  // 分步骤加载聊天记录
  function updateChatMessageStream(id: ChatId, messageId: string, chat: Partial<Chat.ChatMessage>, isMerge: boolean = true) {
    if (!id)
      return
    const index = state.chat[id].data.findIndex(item => item.id === messageId)
    const current = state.chat[id].data[index]
    updateChatMessage(id, messageId, {
      ...current,
      ...chat,
      content: `${current.content || ''}${chat.content || ''}`,
      reasoning_content: `${current.reasoning_content || ''}${chat.reasoning_content || ''}`,
    }, isMerge)
  }

  async function reloadRoute(id: string) {
    await router.replace({ name: 'chat', params: { id }, query: { llmType: currentChat.value?.llmType } })
  }

  /**
   * 移除指定的问题及回答
   */
  function removeChatQuestion(id: ChatId, questionId: string) {
    state.chat[id].data = state.chat[id].data.filter(item => item.questionId !== questionId)
  }

  /**
   * 移除指定的回答
   */
  function removeAnswerByQuestionId(id: ChatId, questionId: string) {
    state.chat[id].data = state.chat[id].data.filter(item => item.questionId !== questionId && item.role === 'robot')
  }

  /**
   * 清空指定会话聊天记录
   */
  function clearChatMessage(id: number) {
    state.chat[id].data = []
  }

  /**
   * 删除指定会话
   */
  // async function deleteChat(id: string) {
  //   Reflect.deleteProperty(state.chat, id)
  // }

  // async function clearAllChat() {
  //   state.chat = {}
  //   state.activeId = undefined
  //   await router.push({ name: 'chat' })
  // }

  return {
    ...toRefs(state),
    currentChat,
    currentMessagesMap,

    updateChat,
    syncChat,
    updateActiveChatId,
    addChatMessage,
    updateChatMessage,
    updateChatMessageStream,
    removeChatQuestion,
    removeAnswerByQuestionId,
    // deleteChat,
    clearChatMessage,
    // clearAllChat,
    reloadRoute,

    addNewChat,
  }
})
