import { fetchChatStream, getAnswerStatus, getQuestionResultDetail } from '@/api/chat'

type ChatId = Chat.ChatMessage['id']

interface Configs {
  scrollToBottom: (force?: boolean) => void
  fetchOptions: {
    url: string
    method?: string
    regenerateUrl?: string
    regenerateMethod?: string
  }
  formatChatData?: (data: any) => Chat.ChatMessage
}

/**
 * 对话界面逻辑
 */
export function useChat({
  scrollToBottom = () => {},
  fetchOptions: {
    url,
    method = 'post',
    regenerateUrl = url,
    regenerateMethod = method,
  },
}: Configs) {
  let controller = new AbortController()
  const chatStore = useChatStore()
  const route = useRoute()
  const router = useRouter()

  const currentChatData = computed(() => chatStore.currentChat?.data ?? [])
  const currentChatInfo = computed(() => (chatStore.currentChat ?? {}) as Chat.ChatConversation)
  const currentLlmType = computed(() => chatStore.currentChat?.llmType)
  const pollDetailQuestionId = ref('')
  const currentChatId = computed(() => chatStore.activeId)
  const prompt = ref<string>('')
  const working = ref<boolean>(false)
  const answerStatus = ref<Chat.ChatStatus>('idle')
  const answerId = ref()
  const lastFinishedPolling = ref()
  const startPollDetailTimer = ref()

  const { isActive: isPollDetailing, pause: stopPollDetail, resume: startPollDetail } = useTimeoutPoll(async () => {
    scrollToBottom()
    // 流式数据返回后或刷新页面后，根据问题id轮询详情
    if (route.path?.startsWith('/chat/') && pollDetailQuestionId.value && (!answerId.value || lastFinishedPolling.value !== answerId.value)) {
      let statusRes
      try {
        statusRes = await getAnswerStatus(pollDetailQuestionId.value)
      }
      catch (err) {
        console.warn(err)
        return
      }

      if (['error', 'cancel'].includes(statusRes.status)) {
        handleStopPollDetail()
        return
      }
      answerStatus.value = statusRes.status
      // 轮询过程中在finish之前，会提前返回suggests，如果返回了，则更新到当前对话中。
      if (statusRes.status !== 'finish' && !statusRes.suggests?.length) {
        scrollToBottom()
        return chatStore.updateChat({ suggests: [] })
      }

      if (statusRes.status !== 'finish') {
        // 更新提示词/摘要
        if (statusRes.suggests?.length) {
          const prevSuggests = currentChatInfo.value.suggests || []
          chatStore.updateChat({ suggests: statusRes.suggests || [] })
          !prevSuggests.length && scrollToBottom(true)
        }
      }
      else {
        handleStopPollDetail()
        lastFinishedPolling.value = answerId.value
        const { id, content, ...restRes } = await getQuestionResultDetail(pollDetailQuestionId.value)
        chatStore.updateChat({ type: restRes.type, suggests: restRes.suggests || [] })

        scrollToBottom()
      }
      return
    }

    handleStopPollDetail()
  }, 1000)

  function handleStartPollDetail() {
    clearTimeout(startPollDetailTimer.value)
    startPollDetail()
  }

  function handleStopPollDetail() {
    stopPollDetail()
    clearTimeout(startPollDetailTimer.value)
  }

  /**
   * 开始提问新问题，往屏幕上输出问题、发出sse请求并流式输出结果
   */
  async function startNewQuestion(options: {
    hide?: boolean
    content?: string
    url?: string
    method?: string
    query?: any // 仅用于重新生成，因为重新生成的参数可能与原问题不同，故单独传入
    questionId?: string
    type?: Chat.ChatMessage['type']
    files?: any[]
    llmType?: string
    withSearch?: boolean
  } = {}) {
    const { content, query, type = 'plain_text', files, llmType, withSearch } = options
    const promptText = query?.question || content || prompt.value

    if (working.value)
      return

    if (!query && (!promptText || promptText.trim() === '') && !files?.length)
      return

    prompt.value = ''
    let questionId = options.questionId ?? `q_local_${uuid()}`
    answerId.value = uuid()

    // 结束历史请求, 清空一些历史数据
    controller.abort()
    handleStopPollDetail()
    controller = new AbortController()
    working.value = true
    chatStore.updateChat({ suggests: [] })

    // 将用户问题添加到聊天列表
    chatStore.addChatMessage(
      currentChatId.value,
      {
        id: questionId,
        questionId,
        dateTime: new Date().toLocaleString(),
        content: promptText,
        role: 'user',
        type,
        withSearch,
      },
    )

    // 立即添加回复框，但是不显示内容，显示loading
    chatStore.addChatMessage(
      currentChatId.value,
      {
        id: answerId.value,
        dateTime: new Date().toLocaleString(),
        questionId,
        content: '',
        status: 'fetching',
        role: 'robot',
        type,
        withSearch,
      },
    )

    let isSseFetchEnd = false
    answerStatus.value = 'fetching'
    scrollToBottom(true)

    try {
      const queryData = query ?? {
        question: promptText,
        question_type: type,
        llm_name: llmType ?? currentLlmType.value ?? DEFAULT_LLMTYPE,
        conversation_id: `${currentChatId.value}`.startsWith('new') ? undefined : currentChatId.value, // 会话id，为空为新会话
      }

      queryData.is_network = withSearch ? 1 : 0

      // 使用sse 请求对话信息
      await fetchChatStream({
        url: options.url || url,
        method: options.method || method,
        data: queryData,
        signal: controller.signal,
        onMessage: async (result: any) => {
          if (result.chatId && result.chatId !== currentChatId.value)
            chatStore.updateActiveChatId(`${result.chatId}`)

          chatStore.updateChatMessage(result.chatId, questionId, { id: result.questionId, questionId: result.questionId })
          questionId = result.questionId
          chatStore.updateChatMessage(result.chatId, answerId.value, {
            questionId: result.questionId,
            ...(result.is_network && (result.network_keywords || result.network_links) && { searchResult: { keywords: result.network_keywords, links: result.network_links } }),
          })

          if (result.dataType === 'stream') {
            answerStatus.value = 'outputting'
            outputContent({ ...result }, answerId.value, isSseFetchEnd)
          }
          // 用于查询提示词等信息
          pollDetailQuestionId.value = result.questionId
        },
      })

      if (!isPollDetailing.value && (answerStatus.value as any) !== 'cancel') {
        handleStopPollDetail()
        startPollDetailTimer.value = setTimeout(handleStartPollDetail, 20)
      }
    }
    catch (error: any) {
      message.error(error.message)
      scrollToBottom(true)
      chatStore.updateChatMessage(currentChatId.value, answerId.value, { content: error.message ?? '发生错误，请重试' })
      console.warn('error', error)
    }
    finally {
      isSseFetchEnd = true
      answerStatus.value = 'idle'
      working.value = false
      scrollToBottom(true)
    }
  }

  async function outputContent(message: Chat.ChatMessage, currentId: Chat.ChatMessage['id'], isFetchEnd: boolean) {
    try {
      const { content } = message
      if (isFetchEnd && !content)
        return

      if (!message)
        return await new Promise(resolve => setTimeout(resolve, 100))

      answerStatus.value = 'outputting'
      chatStore.updateChatMessageStream(currentChatId.value, currentId, { ...message, status: 'outputting' })
      // 假流式输出效果
      // const chunkSize = 5;
      // for (let i = 0; i < content.length; i += chunkSize) {
      //   const contentPiece = content.substring(i, i + chunkSize);
      //   chatStore.updateChatMessageStream(currentChatId.value, currentId, { ...message, content: contentPiece, status: 'outputting' })
      //   await new Promise(resolve => setTimeout(resolve, 10))
      //   scrollToBottom()
      // }
    }
    catch (error) {
      throw new Error(`解析消息失败: ${error}`)
    }
    finally {
      scrollToBottom()
    }
  }

  /**
   * 通过历史记录开始对话
   */
  const startByHistory = async ({ chatId: _chatId, llmType, isShare, ...chatData }: {
    chatId: ChatId
    llmType?: string
    isShare?: boolean
    [x: string]: any
  }) => {
    controller.abort()
    working.value = false
    answerStatus.value = 'idle'
    const chat = await chatStore.syncChat({ chatId: _chatId, llmType, isShare, ...chatData })
    scrollToBottom(true)
    // TODO: 目前正在回复中刷新页面后显示对话已结束，如果后续需要轮询重新加载对话使用下面的代码
    // if (currentData[currentData.length - 1]?.status !== 'finish') {
    //   pollDetailQuestionId.value = currentData[currentData.length - 1].questionId
    //   startPollDetail()
    // }
    const lastData = chat?.data[chat?.data?.length - 1]
    answerStatus.value = lastData?.status || answerStatus.value
    if (lastData?.status === 'cancel' && !lastData?.content)
      chatStore.updateChatMessage(_chatId, lastData.id, { content: '回答已中止' })

    if (!isShare && !['cancel', 'finish', 'error'].includes(lastData?.status as any) && lastData?.questionId) {
      pollDetailQuestionId.value = lastData?.questionId
      answerId.value = lastData.id
      handleStopPollDetail()
      handleStartPollDetail()
    }

    return chat
  }

  /**
   * 输入完成提交输入框内容并开始对话
   */
  async function submitTextAndStart({ content, files, type, withSearch }: { content?: string, files?: any[], type?: string, withSearch?: boolean } = {}) {
    if ((content && content.trim() !== '') || files?.length)
      startNewQuestion({ content, files, type: (type as Chat.Type) || 'plain_text', withSearch })
  }

  /**
   * 开始新会话，清空状态等
   */
  async function startNewChat(options?: Parameters<typeof startNewQuestion>[0]) {
    controller.abort()
    working.value = false
    await chatStore.addNewChat(options?.llmType)
    options && startNewQuestion(options)
  }

  /**
   * 重新回答问题/修改问题
   */
  async function regenerateMessage(questionId: string, withSearch: boolean, text?: string) {
    const question = { ...chatStore.currentMessagesMap[questionId] }
    if (question) {
      chatStore.removeChatQuestion(currentChatId.value, questionId)
      return startNewQuestion({
        url: regenerateUrl,
        method: regenerateMethod,
        content: text ?? question.content,
        questionId,
        type: question.type,
        query: {
          question: text ?? question.content,
          id: `${questionId}`.startsWith('q_local') ? undefined : questionId,
        },
        withSearch: withSearch ?? question.withSearch,
      })
    }
  }

  /**
   * 修改问题
   */
  async function editQuestion(questionId: string, withSearch: boolean, text: string) {
    return regenerateMessage(questionId, withSearch, text)
  }

  function cancelChatFetch() {
    controller.abort()
    working.value = false
    answerStatus.value = 'cancel'
    handleStopPollDetail()
  }

  const llmChanging = ref(false)
  /**
   * 切换当前会话大模型
   */
  async function changeLlmType({ llmType, isShare, questionId, withSearch }: { llmType: string | undefined, questionId: string, isShare: boolean, withSearch?: boolean }) {
    handleStopPollDetail()

    // 更新之前先把当前会话初始问题保存下来
    const currentQuestion = chatStore.currentChat?.data?.find(v => v.role === 'user' && v.questionId === questionId)
    llmChanging.value = true
    chatStore.updateChat({ llmType })
    router.replace({ query: { ...route.query, llmType } })

    let chat
    if (!currentChatId.value.startsWith('new')) {
      chat = await startByHistory({ chatId: currentChatId.value, llmType, isShare, lastSuggestQuestion: currentQuestion })
      llmChanging.value = false
    }

    if (!isShare && !chat?.data?.length) {
      controller.abort()
      working.value = false
      answerStatus.value = 'fetching'
      await startNewQuestion({ content: currentQuestion?.content, files: currentQuestion?.fileList, type: currentQuestion?.type, withSearch })
    }

    return chat
  }

  onUnmounted(() => {
    if (working.value)
      controller.abort()

    handleStopPollDetail()
  })

  watch([currentChatId, currentLlmType], () => handleStopPollDetail())

  return {
    currentChatInfo,
    currentChatData,
    prompt,
    working,
    answerStatus,
    startNewChat,
    startNewQuestion,
    startByHistory,
    submitTextAndStart,
    regenerateMessage,
    editQuestion,
    cancelChatFetch,
    llmChanging,
    changeLlmType,
  }
}
