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

export function isImageUrl(file: any) {
  if (file?.url) {
    const [originUrl] = file.url.split('?')
    const format = originUrl.split('.').pop().toLowerCase()
    return imageFormats.includes(format)
  }
  return false
}
