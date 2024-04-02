export const devServer = {
  dev: {
    baseUrl: 'https://example.com',
  },
  test: {
    baseUrl: 'https://example.com',
  },
  staging: {
    baseUrl: 'https://example.com',
  },
  prod: {
    baseUrl: 'https://example.com',
  },
}.dev

// https://cn.vitejs.dev/config/server-options.html#server-proxy
const server = {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  hmr: true,
  proxy: {
    // 如需使用mock，除了配置mock文件外还需注释掉此处的转发，或修改mock请求为如/mock/api/xxx
    // '/api': {
    //   target: devServer.baseUrl,
    //   changeOrigin: true,
    // },
  },
}

export default server
