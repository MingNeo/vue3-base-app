import { imageEnums } from '@/config'

export { v4 as uuid } from 'uuid'

export function getLoginToken() {
  try {
    return localStorage.getItem('token') || ''
  }
  catch (error) {
    console.warn(error)
    return ''
  }
}

// 获取完整Cdn资源地址
export function getCdnUrl(url: string) {
  if (!url)
    return ''

  if (url.startsWith('http') || url.startsWith('//'))
    return url

  if (import.meta.env.MODE === 'development') {
    url = url.replace(/^(@\/|\/)/, '/src/')
    return new URL(url, `${location.origin}`).href
  }

  url = url.replace(/^@\//, '/')
  return import.meta.env.VITE_CDN_PATH ? new URL(url, import.meta.env.VITE_CDN_PATH).href : url
}

export function unbind<T>(value: T): T {
  let result = value
  try {
    result = JSON.parse(JSON.stringify(value))
  }
  catch (error) {
    console.warn(error)
  }
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

export function isImageUrl(file: any) {
  if (file?.url) {
    const [originUrl] = file.url.split('?')
    const format = originUrl.split('.').pop().toLowerCase()
    return imageEnums.includes(format)
  }
  return false
}
