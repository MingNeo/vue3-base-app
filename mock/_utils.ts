/**
 * 提供一些用于mock的方法
 */

/**
 * 对成功的返回值进行包装
 */
export function wrapperSuccess(result: any) {
  return {
    code: 200,
    result,
    type: 'success',
    success: true,
  }
}

export function wrapperError(
  message = 'Request failed',
  { code = 500, result = null } = {},
) {
  return {
    code,
    result,
    message,
    error: message,
    type: 'error',
  }
}

// 从请求头中获取token
export function getRequestToken({ headers }: any) {
  // header 不区分大小写，到服务侧都是小写
  return headers?.authorization
}

export function pagination<T = any>(page: number, pageSize: number, listData: T[]): T[] {
  const start = (page - 1) * pageSize
  // 当 start + pageSize 大于等于 listData.length 时，slice 方法会自动截取到数组末尾
  return listData.slice(start, start + pageSize)
}

export function wrapperPageSuccess<T = any>({
  page = 1,
  pageSize = 10,
  list,
  total,
}: {
  page?: number
  pageSize?: number
  list: T[]
  total?: number
},
) {
  const pageData = pagination(page, pageSize, list)

  return {
    ...wrapperSuccess({
      data: pageData,
      total: total ?? list.length,
    }),
  }
}
