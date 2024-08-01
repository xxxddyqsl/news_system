const { createProxyMiddleware } = require('http-proxy-middleware')
/*
  配置反向代理 - 每次配置修改需要重启项目
   安装  npm install --save http-proxy-middleware

      第一步：创建代理配置文件
      在src下创建配置文件：src/setupProxy.js (注意： 文件名必须是setupProxy.js)

      安装  npm install --save http-proxy-middleware

      第二步：编写setupProxy.js配置具体代理规则

      const  {createProxyMiddleware} = require('http-proxy-middleware')
      module.exports = function(app) {
        app.use(
          createProxyMiddleware('/api1', {  //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
            target: 'http://localhost:5000', //配置转发目标地址(能返回数据的服务器地址)
            changeOrigin: true, //控制服务器接收到的请求头中host字段的值

              //changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
              //changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
              //changeOrigin默认值为false，但我们一般将changeOrigin值设为true

              pathRewrite: {'^/api1': ''} //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
            }),
            createProxyMiddleware('/api2', {
              target: 'http://localhost:5001',
              changeOrigin: true,
              pathRewrite: {'^/api2': ''}
            })
          )
        }

        说明：
        优点：可以配置多个代理，可以灵活的控制请求是否走代理。
        缺点：配置繁琐，前端请求资源时必须加前缀。
 
*/

module.exports = function (app) {
  app.use(
    // createProxyMiddleware('/api',
    //   // 代理 前缀 有/api的请求 需要反向代理
    //   {
    //     target: 'https://i.maoyan.com/',//配置转发目标地址 类似nginx
    //     changeOrigin: true,//设置为true时，服务器收到的请求头中的host为：https://i.maoyan.com
    //     pathRewrite: { '^/api': '' } //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
    //   }),
    createProxyMiddleware('/api', {
      target: 'http://172.18.70.26:4399/',
      // target: 'http://192.168.10.5:4399/',//
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }),
    // createProxyMiddleware('/uploads', {// 接口返回的 图片地址转发
    //     target: 'http://172.18.70.26:4399/',
    //     // target: 'http://192.168.10.5:4399/',//
    //     changeOrigin: true,
    //     pathRewrite: { '^/api': 'uploads' }
    //   }),
    
  )
}