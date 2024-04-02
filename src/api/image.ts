import request from '~/utils/request'

export const upload = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request('/api/web/image/upload', {
    method: 'post',
    data: formData,
  })
}

export const getImageList = (params: any) => {
  return request('/api/web/image/list', {
    method: 'post',
    data: params,
  })
}

export const addImage = (params: any) => {
  return request('/api/web/image/add', {
    method: 'post',
    data: params,
  })
}

export const deleteImage = (params: any) => {
  return request('/api/web/image/delete', {
    method: 'post',
    data: params,
  })
}
