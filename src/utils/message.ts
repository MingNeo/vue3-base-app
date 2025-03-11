import Message from '@/components/common/Message.vue'
import { createVNode, render } from 'vue'

let instance: {
  $props: {
    title: string
    content?: string
    type: 'success' | 'error' | 'info' | 'warning' | 'loading'
  }
  open: () => void
} | null = null

export function message(options: { title: string, content?: string, type: 'success' | 'error' | 'info' | 'warning' | 'loading' }) {
  if (typeof window !== 'undefined') {
    if (!instance) {
      const mountNode = document.createElement('div')
      document.body.appendChild(mountNode)

      const vnode = createVNode(Message, options)
      render(vnode, mountNode)

      // 确保组件实例存在
      if (!vnode.component) {
        throw new Error('Failed to create message component')
      }

      instance = {
        $props: vnode.component.props as any,
        open: () => vnode.component?.exposed?.open(),
      }
    }
    else {
      Object.assign(instance.$props, options)
    }

    instance?.open()
  }
}

message.success = (text: string) => message({ title: text, type: 'success' })
message.error = (text: string) => message({ title: text, type: 'error' })
message.info = (text: string) => message({ title: text, type: 'info' })
message.warn = (text: string) => message({ title: text, type: 'warning' })
message.loading = (text: string) => message({ title: text, type: 'loading' })

export default message
