import { wrapperSuccess } from './_utils'

let imageList = [
  { id: 1, name: '洗护用品', url: 'http://img0.baidu.com/it/u=2900833435,993445529&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500' },
  { id: 11, name: '舒肤佳', url: 'http://img1.baidu.com/it/u=847956157,2750448390&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500' },
  { id: 111, name: '肥皂', url: 'http://img2.baidu.com/it/u=2243573419,589412055&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 112, name: '沐浴露', url: 'http://img0.baidu.com/it/u=3957758939,1600769248&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800' },
  { id: 2, name: '酒水饮料', url: 'http://img2.baidu.com/it/u=2988589017,2923917558&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800' },
  { id: 21, name: '可口可乐', url: 'http://img0.baidu.com/it/u=1866074124,1029309522&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800' },
  { id: 211, name: '有糖', url: 'http://img2.baidu.com/it/u=1929941019,3324507395&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 212, name: '无糖', url: 'http://img1.baidu.com/it/u=94904965,608097738&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 22, name: '茅台', url: 'http://img0.baidu.com/it/u=3822016102,3026244821&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281' },
  { id: 221, name: '52度', url: 'http://img2.baidu.com/it/u=3334115308,1054927257&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500' },
  { id: 222, name: '43度', url: 'http://img1.baidu.com/it/u=1304255642,2961408783&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 223, name: '38度', url: 'http://img0.baidu.com/it/u=2171411284,1924893541&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 3, name: '休闲零食', url: 'http://img0.baidu.com/it/u=1209717743,1836540112&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 4, name: '粮油调味', url: 'http://img2.baidu.com/it/u=3867960631,2923014190&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 5, name: '水果鲜花', url: 'http://img0.baidu.com/it/u=891036130,2043934807&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
]

const uploadImageList = [
  'http://img2.baidu.com/it/u=673003775,1191479950&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  'http://img0.baidu.com/it/u=3358258296,36412822&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800',
  'http://img1.baidu.com/it/u=3771202995,2341004196&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  'http://img2.baidu.com/it/u=3285657609,1048743885&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
  'http://img0.baidu.com/it/u=1188128476,2692382549&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
]

export default [
  {
    url: '/api/web/image/list',
    timeout: 200,
    method: 'post',
    response: () => wrapperSuccess({ data: imageList, total: imageList.length }),
  },
  {
    url: '/api/web/image/add',
    timeout: 200,
    method: 'post',
    response: ({ body }: any) => {
      const images = body.map((item: any) => ({ ...item, id: Math.floor(Math.random() * 100000) }))
      imageList.unshift(...images)
      return wrapperSuccess(true)
    },
  },
  {
    url: '/api/web/image/delete',
    timeout: 200,
    method: 'post',
    response: ({ body }: any) => {
      imageList = imageList.filter(({ id }) => !body.includes(id))
      return wrapperSuccess(true)
    },
  },
  {
    url: '/api/web/image/upload',
    timeout: 200,
    method: 'post',
    response: () => wrapperSuccess(uploadImageList[Math.floor(Math.random() * 5)]),
  },
]
