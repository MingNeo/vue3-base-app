declare namespace Chat {
  // 服务端状态：解析中：parsing 分析中：analyzing 总结中：summarizing 完成：finish 取消：cancel 错误：error
  // 客户端状态：空闲：idle 获取中：fetching 输出中：outputing 输出完成：outputed
  type ChatStatus = 'idle' | 'fetching' | 'searching' | 'outputting' | 'outputed' | 'error' | 'finish' | 'cancel'

  type Type = 'plain_text' | 'url' | 'video' | 'audio' | 'document' | 'pic'

  interface ChatMessage {
    type?: Type
    isHistory?: boolean
    withSearch?: boolean
    questionId?: string
    id: string
    dateTime?: string
    content: string
    reasoning_content?: string
    role?: 'user' | 'robot'
    status?: ChatStatus
    suggests?: string[]

    searchResult?: {
      keywords?: string[]
      links?: Record<string, any>[]
    }
  }

  interface ChatStreamData extends ChatMessage {
    chatId: ChatConversation.id
    dataType: 'stream'
  }

  interface ChatConversation {
    id: string
    title?: string
    status?: ChatStatus
    data: ChatMessage[]
    suggests?: string[]
    llmType?: string
    type?: Type
  }

  interface History extends ChatConversation {
    loading?: boolean
  }

  interface ChatState {
    activeId: Chat.ChatMessage['id']
    history?: History[]
    chat: Record<string, ChatConversation>
  }
}
