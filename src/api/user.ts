import request from '~/utils/request'

export const login = (params: any) => {
  return request('/api/web/uc/login-h5', {
    method: 'post',
    data: params,
  })
}

export const getInfo = () => {
  return request('/api/web/uc/current', {
    method: 'get',
  })
}

export const logout = (params: any) => {
  return request('/api/web/uc/logout', {
    method: 'post',
    data: params,
  })
}

export const getUserList = (params: any) => {
  return request('/api/web/uc/paging', {
    method: 'post',
    data: params,
  })
}
