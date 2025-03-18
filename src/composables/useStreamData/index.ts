import { fetchEvent } from '@/utils/fetch-event-source'

interface ResultData {
  status?: string
  content?: string
}

interface Configs {
  scrollToBottom?: (force?: boolean) => void
  url: string
  method?: string
  formatChatData?: (data: any) => ResultData
  /* 请求参数中prompt的key */
  textKey: string
  onMessage?: (data: any, text?: string) => void
  onSuccess?: (text: string) => void
  outputOriginResult?: boolean
  formatMarkdown?: boolean
  formatOriginText?: (text: string) => string
  onError?: (error: any) => void
  resetWhenError?: boolean
}

type Status = 'idle' | 'fetching' | 'outputting' | 'error' | 'cancel'

/**
 * 流式逻辑
 */
export function useStreamData({
  scrollToBottom = () => {},
  url = '',
  method = 'post',
  textKey = 'content',
  onMessage,
  outputOriginResult = false,
  formatMarkdown = true,
  formatOriginText,
  onSuccess,
  onError,
  resetWhenError = true,
}: Configs) {
  let controller = new AbortController()

  const questionData = ref<Record<string, any>>({ content: '' })
  const status = ref<Status>('idle')
  const originResultText = ref('')
  const resultText = ref('')

  /**
   * 开始提问新问题，往屏幕上输出问题、发出sse请求并流式输出结果
   */
  async function startQuestion<Q extends Record<string, any>>(query: Q, options: Record<string, any> = {}) {
    const { fetchUrl = url } = options
    const promptText = query[textKey]

    if (status.value === 'fetching')
      return

    if (!query && !promptText.trim())
      return

    // 结束历史请求, 清空一些历史数据
    controller.abort()
    controller = new AbortController()
    status.value = 'fetching'
    originResultText.value = ''
    resultText.value = ''

    scrollToBottom(true)

    try {
      // 使用sse 请求对话信息
      await fetchEvent({
        url: fetchUrl,
        method,
        data: query,
        signal: controller.signal,
        onMessage: async (result: any) => {
          status.value = 'outputting'

          if (outputOriginResult) {
            onMessage?.(result)
          }
          else {
            const newText = await _outputContent({ ...result }) as string
            onMessage?.(result, newText)
          }

          scrollToBottom()
        },
      })

      onSuccess?.(resultText.value)
    }
    catch (error: any) {
      const errorMessage = error.message || error.error_msg
      errorMessage && message.error(errorMessage)
      scrollToBottom(true)

      if (resetWhenError) {
        originResultText.value = ''
        resultText.value = ''
        status.value = 'idle'
      }
      else {
        status.value = 'error'
      }

      console.warn('error', error)

      onError?.(error)
    }
    finally {
      if (resetWhenError || status.value !== 'error') {
        status.value = 'idle'
      }
      scrollToBottom(true)
    }
  }

  async function _outputContent(result: any) {
    try {
      const content = result?.data?.result || ''
      if (!content)
        return

      if (!result)
        return await new Promise(resolve => setTimeout(resolve, 100))

      const newContent = (originResultText.value || '') + content
      updateOriginAndResultText(newContent)
      return resultText.value
    }
    catch (error) {
      throw new Error(`解析消息失败: ${error}`)
    }
  }

  function updateOriginAndResultText(newOriginText: string) {
    originResultText.value = formatOriginText ? formatOriginText(newOriginText) : newOriginText
    resultText.value = formatMarkdown ? renderMarkdown(originResultText.value) : originResultText.value
  }

  /**
   * 输入完成提交输入框内容并开始对话
   */
  async function quickStart(content?: string) {
    if (content && content.trim() !== '')
      startQuestion({ [textKey]: content })
  }

  function cancelFetch() {
    controller.abort()
    status.value = 'idle'
  }

  function resetState() {
    resultText.value = ''
    // originResultText.value = ''
    status.value = 'idle'
  }

  function updateResultText(newValue: string) {
    resultText.value = newValue
    status.value = 'idle'
  }

  onUnmounted(() => {
    if (status.value)
      controller.abort()
  })

  return {
    questionData,
    status,
    startQuestion,
    quickStart,
    cancelFetch,
    originResultText,
    resultText,
    resetState,
    updateResultText,
    updateOriginAndResultText,
  }
}
