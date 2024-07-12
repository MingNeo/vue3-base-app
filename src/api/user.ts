import request from '@/utils/request'

export async function login(params: any) {
  const result = await request('/api/user/login', {
    method: 'post',
    data: params,
  })
  return result
}

export function getCaptcha() {
  return request('/api/user/captcha', {
    method: 'post',
  })
}

export function getInfo() {
  return request('/api/user/current', {
    method: 'get',
  })
}

export function logout(params: any) {
  return request('/api/user/logout', {
    method: 'post',
    data: params,
  })
}

export function getUserList(params: any) {
  return request('/api/user/list', {
    method: 'post',
    data: params,
  })
}
