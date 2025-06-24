const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
   chainWebpack: config => {
    config.module
      .rule('html')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader')
      .end();
    config.module
      .rule('audio')
      .test(/\.(mp3|ogg|wav)$/)
      .type('asset/resource')
      .set('generator', {
        filename: 'assets/sounds/[name].[hash:8][ext]'
      });
  },
  publicPath: '/myfrontend'
})
