const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port:80,
    proxy:{
      '/api':{
        //TODO 下面改成你们自己主机的后端项目运行端口
        target:'http://localhost:8080',
        pathRewrite:{
          '^/api':''
        }
      }
    }
  }
})
