


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
          
        },
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true, // serialport
            externals: ['better-sqlite3'], //不进行编译的文件
            builderOptions: {
                // "publish": [ //下载自动更新
                //     {
                //         "provider": "generic",
                //         "url": "http://localhost:8080/verson",
                //         //注：这个url就是放.yml文件和安装包的服务器地址,我这里用的是 上传地址
                //     }
                // ],
                'appId': 'com.waddc.fundexplore', //包名,程序的唯一标识符
                'productName': 'fundexplore', // 项目名，也是生成的安装文件名，即wyDemo.exe
                'copyright': 'joyfun Copyright © 2021', // 版权信息
                'files': [
                    './**/*'
                ],
                // 'win': { // win相关配置
                //     'icon': './favicon.ico', // 图标，当前图标在根目录下，注意图标格式，保证图标存在；
                //     "requestedExecutionLevel": "requireAdministrator", //获取管理员权限
                //     'target': [{
                //         'target': 'nsis', // 利用nsis制作安装程序
                //         'arch': [ // 这个意思是打出来32 bit + 64 bit的包，但是这样打包出来的安装包体积比较大
                //             'x64', // 64位
                //             'ia32'
                //         ]
                //     }]
                // },
                'nsis': {
                    'oneClick': false, // 是否一键安装
                    'allowElevation': true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    'allowToChangeInstallationDirectory': true, // 允许修改安装目录
                    // 'installerIcon': './favicon.ico', // 安装图标
                    // 'uninstallerIcon': './favicon.ico', // 卸载图标
                    // 'installerHeaderIcon': './favicon.ico', // 安装时头部图标
                    'createDesktopShortcut': true, // 创建桌面图标
                    'createStartMenuShortcut': true, // 创建开始菜单图标
                    'shortcutName': '基金查看器' // 图标名称(项目名称)
                }
            }
        }
    }
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