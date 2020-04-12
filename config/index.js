'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/apis': {
      //   target: 'http://localhost:8096',  // nginx反向代理服务器地址，匹配/apis后反向代理为 /temo/
      //   changeOrigin: true,  //是否跨域
      //   pathRewrite: {
      //     '/apis': ''   //需要rewrite重写的,
      //   },
      //   onProxyReq: function (proxyReq, req, res) {
      //     //实在不知道代理后的路径，可以在这里打印出出来看看
      //     console.log("原路径：" + req.originalUrl, "代理路径：" + req.path)
      //   }
      // }
    },


    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../teemo/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../teemo'),  // 看下打包好的目录，对比之后会发现多了一层deploy目录，这个多出来的路径是index和assetsRoot这两个设置决定的
    assetsSubDirectory: 'static',
    assetsPublicPath: '/teemo/',  // assetsPublicPath则是确定打包后的文件引用路径

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
