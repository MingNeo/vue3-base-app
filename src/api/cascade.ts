import request from '@/utils/request'

export function getCascadeList(parentId?: string | number) {
  return request('/api/web/cascade/list', {
    method: 'post',
    data: { parentId },
  })
}

export function getCascadeTree() {
  return request('/api/web/cascade/tree', {
    method: 'post',
    data: {},
  })
}
