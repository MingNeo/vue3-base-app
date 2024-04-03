import request from '~/utils/request'

export const login = (params: any) => {
  return request('/api/user/login', {
    method: 'post',
    data: params,
  })
}

export const getCaptcha = () => {
  return request('/api/user/captcha', {
    method: 'post',
  })
}

export const getInfo = () => {
  return request('/api/user/current', {
    method: 'get',
  })
}

export const logout = (params: any) => {
  return request('/api/user/logout', {
    method: 'post',
    data: params,
  })
}

export const getUserList = (params: any) => {
  return request('/api/user/list', {
    method: 'post',
    data: params,
  })
}
