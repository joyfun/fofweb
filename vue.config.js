


module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        open: true,
        proxy: {
            '/fof': {
                target: 'http://127.0.0.1:3002/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false                  //是否https接口
            },
            '/sys': {
                target: 'http://127.0.0.1:3002/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false                  //是否https接口
            },
            '/api/testcase/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/testcase/': '/api/testcase/'
                }
            },
            // '/api/testresult/': {
            //     target: 'http://127.0.0.1:8081/', //接口域名
            //     changeOrigin: true,             //是否跨域
            //     ws: true,                       //是否代理 websockets
            //     secure: false,                   //是否https接口
            //     pathRewrite: {                  //路径重置
            //         '^/api/testresult/': '/api/testresult/'
            //     }
            // },
            '/api/testcase/case/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/testcase/case/': '/api/testcase/case/'
                }
            },
            '/api/tetask/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/tetask/': '/api/tetask/'
                }
            },
            '/api/temoudle/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/temoudle/': '/api/temoudle/'
                }
            },
             '/api/testtask/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/testtask/': '/api/testtask/'
                }
            },



            '/api/chartdata1/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/chartdata1/': '/api/chartdata1/'
                }
            },
             '/api/chartdata2/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/chartdata2/': '/api/chartdata2/'
                }
            },
            '/api/chartdata3/': {
                target: 'http://127.0.0.1:8081/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/api/chartdata3/': '/api/chartdata3/'
                }
            },
        },
    },
}












//vue.config.js 常用配置

// module.exports = {
//     publicPath: '/',
//     outputDir: 'dist',
//     assetsDir: '',
//     //生成环境sorceMap
//     productionSourceMap: true,
//     //webpack配置
//     configureWebpack: () => {},
//     chainWebpack: () => {},
//
//     //css相关配置
//     css: {
//         // 启用css modules
//         modules: false,
//         // 是否使用css分离插件
//         extract: true,
//         // 开启csss source maps
//         sourceMap: false,
//         // css
//         loaderOptions: {},
//      },
//     devServer: {
//     host: '0.0.0.0',
//     port: 8080,
//     proxy: {},
//     },
//      pluginOptions: {
//          // ...     }
//      }
// }