import type MarkdownIt from 'markdown-it'
import markdownit from 'markdown-it'
import Prism from 'prismjs'
// import 'prismjs/themes/prism.min.css'

let md: markdownit | null = null

function markDownItCodeSection(md: MarkdownIt) {
  const { escapeHtml } = md.utils
  // 为复制功能绑定点击事件，点击自动复制code的内容
  try {
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.md-code-section__copy')
      if (target) {
        const code = target.parentElement?.nextElementSibling?.querySelector('code')
        if (code?.textContent) {
          copyToClipboard(code.textContent)
          target.classList.add('success')
          setTimeout(() => target.classList.remove('success'), 1000)
        }
      }
    })
  }
  catch (error) {
    console.error(error)
  }

  // markdown中的html作为ai输出的文本，应该转义以防止被解析
  md.renderer.rules.html_inline = (tokens, idx) => {
    return escapeHtml(tokens[idx].content.trim())
  }
  md.renderer.rules.html_block = (tokens, idx) => {
    return `${escapeHtml(tokens[idx].content.trim())}<br />`
  }

  md.renderer.rules.fence = (tokens, idx) => {
    const { info, content = '' } = tokens[idx]
    const lang = { vue: 'html', htm: 'html' }[info] || info || 'txt'
    let str = content.trim()

    str = Prism.languages[lang]
      ? Prism.highlight(
        str,
        Prism.languages[lang],
        lang,
      )
      : str

    return `<pre class="md-code-section__code language-${lang}"><code>${str}</code></pre>`.trim()
  }
}

export function renderMarkdown(text: string) {
  // 只有使用时才生成实例
  if (!md) {
    md = markdownit({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
    })
    md.use(markDownItCodeSection)
  }
  return md.render(text)
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText ? navigator.clipboard.writeText(text) : document.execCommand('copy')
}
