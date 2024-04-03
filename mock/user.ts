import { getRequestToken, wrapperError, wrapperPageSuccess, wrapperSuccess } from './_utils'

const mockUser = {
  address: {},
  avatarUrl: '',
  birthDate: '',
  createdAt: '',
  email: '',
  emailVerified: true,
  familyName: '',
  gender: '',
  givenName: '',
  locale: '',
  metadata: '',
  middleName: '',
  name: '',
  nickname: '',
  phoneNumber: '',
  phoneNumberVerified: true,
  profile: '',
  realName: '',
  updatedAt: '',
  userId: 10000,
  username: '',
  website: '',
  zoneinfo: '',
  roles: ['admin'],
  permissions: ['demoList:del'],
}

const mockLoginResult = {
  expireTime: 1 * 24 * 60 * 60,
  extra: {},
  firstLogin: true,
  tenantIdLong: 0,
  token: 'mockToken222',
  userId: 0,
}

const mockUserList = new Array(10).fill('').map((v, i) => ({
  address: {},
  avatarUrl: '',
  birthDate: '',
  createdAt: '',
  email: `${i + 1}@email.com`,
  emailVerified: true,
  familyName: '',
  gender: Math.round(Math.random()) ? '男' : '女',
  givenName: '',
  locale: '',
  metadata: '',
  middleName: '',
  name: `用户${i + 1}`,
  nickname: `用户${i + 1}`,
  phoneNumber: '132xxxxxxxxx',
  phoneNumberVerified: true,
  profile: '',
  realName: `用户${i + 1}`,
  updatedAt: '',
  userId: i + 1,
  username: '',
  website: '',
  zoneinfo: '',
}))

export default [
  {
    url: '/api/user/login',
    timeout: 200,
    method: 'post',
    response: () => wrapperSuccess(mockLoginResult),
  },
  {
    url: '/api/user/current',
    method: 'get',
    response: (request: any) => {
      const token = getRequestToken(request)
      if (!token)
        return wrapperError('Invalid token', { code: 401 })
      return wrapperSuccess(mockUser)
    },
  },
  {
    url: '/api/user/logout',
    timeout: 200,
    method: 'get',
    response: () => {
      return wrapperSuccess(undefined)
    },
  },
  {
    url: '/api/user/list',
    timeout: 200,
    method: 'post',
    response: ({ body }: any) => {
      return wrapperPageSuccess({ page: body?.pageNo || 1, pageSize: body?.pageSize || 5, list: mockUserList })
    },
  },
]
