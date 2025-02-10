export const menus = [
  // {
  //   key: 'manage',
  //   title: '首页',
  //   path: '/',
  // },
  {
    key: 'manage',
    title: 'manage',
    children: [
      {
        key: 'manage-test',
        title: '测试页',
        path: '/manage',
      },
    ],
  },
  {
    key: 'test',
    title: '权限测试页',
    path: '/testauth',
  },
  {
    key: 'userList',
    title: '404',
    path: '/xxx',
  },
]
