import request from '~/utils/request'

export const getCascadeList = (parentId?: string | number) => {
  return request('/api/web/cascade/list', {
    method: 'post',
    data: { parentId },
  })
}

export const getCascadeTree = () => {
  return request('/api/web/cascade/tree', {
    method: 'post',
    data: {},
  })
}
