type MessageType = 'success' | 'error' | 'info' | 'warning'

export function showMessage(message: string, type: MessageType = 'info') {
  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.top = '16px'
  div.style.left = '50%'
  div.style.transform = 'translate(-50%, 0)'
  div.style.opacity = '1'
  div.style.padding = '8px 16px'
  div.style.color = '#fff'
  div.style.borderRadius = '8px'
  div.style.zIndex = '50'
  div.style.transition = 'all 0.3s'
  div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)'
  div.style.backgroundColor = type === 'success'
    ? 'rgba(0, 171, 169, 0.8)'
    : type === 'error'
      ? 'rgba(255, 0, 0, 0.8)'
      : type === 'warning'
        ? 'rgba(255, 215, 0, 0.8)'
        : 'rgba(0, 0, 255, 0.8)'

  div.textContent = message
  document.body.appendChild(div)

  setTimeout(() => {
    div.style.transform = 'translate(-50%, -100%)'
    div.style.opacity = '0'
    setTimeout(() => div.remove(), 300)
  }, 2000)
}

export const message = {
  success: (msg: string) => showMessage(msg, 'success'),
  error: (msg: string) => showMessage(msg, 'error'),
  warning: (msg: string) => showMessage(msg, 'warning'),
  info: (msg: string) => showMessage(msg, 'info'),
}
