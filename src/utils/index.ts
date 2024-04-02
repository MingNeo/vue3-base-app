import dayjs from 'dayjs'
import { imageFormats } from '~/config'
export { v4 as uuid } from 'uuid'

export function unbind<T>(value: T): T {
  let result = value
  try {
    result = JSON.parse(JSON.stringify(value))
  }
  catch (error) { }
  return result
}

// 将数组转化为obj，以指定key为键
export function arrayToObject(array: any[], key = 'value', getValue = (v: any, _index: number) => v) {
  const result: Record<string, any> = {}
  array.forEach((item, index) => {
    result[item[key]] = getValue(item, index)
  })
  return result
}

export function formatDate(value: any) {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

export function parseValue(value?: string | null): any {
  let result = value
  try {
    result = JSON.parse(value as string)
  }
  catch (error) { }
  return result
}

export function sliceStr(str = '', size: number) {
  return str.length > size ? `${str.slice(0, size)}...` : str
}

export function shrinkObject(value: Record<string, any>) {
  const result = { ...value }
  Object.keys(result).forEach(k => !result[k] && delete result[k])
  return result
}

// 处理返回数值，x.00展示 x,否则固定两位小数
export function formateNumber(value: string | number) {
  const nums = String(value).split('.')
  return nums[1] === '00' ? nums[0] : Number(value).toFixed(2)
}

export function isImageUrl(file: any) {
  if (file?.url) {
    const [originUrl] = file.url.split('?')
    const format = originUrl.split('.').pop().toLowerCase()
    return imageFormats.includes(format)
  }
  return false
}

export function flattenTree(tree: string | any[]) {
  const flattened: any[][] = []

  function traverse(node: { value: any; children: string | any[] }, path: any[]) {
    path.push(node.value)

    if (node.children.length === 0) {
      flattened.push([...path])
    }
    else {
      for (let i = 0; i < node.children.length; i++)
        traverse(node.children[i], path)
    }

    path.pop()
  }

  for (let i = 0; i < tree.length; i++)
    traverse(tree[i], [])

  return flattened
}

export function printPdf(pdfUrl: string) {
  if (pdfUrl) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = pdfUrl
    document.body.appendChild(iframe)

    iframe.onload = () => {
      const iframeContentWindow = iframe.contentWindow as Window
      iframeContentWindow.focus()
      iframeContentWindow.print()
      document.body.removeChild(iframe)
    }
  }
}
