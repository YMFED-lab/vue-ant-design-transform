const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

const HOST = '0.0.0.0';
const PORT = '9001';
// const DEV_URL = 'http://10.200.10.48/';
const DEV_URL = 'http://10.1.190.122:8000/'
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    productionSourceMap: false,
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    blue: '#3a82f8',
                    'text-color': '#333'
                },
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        host: HOST,
        port: PORT,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                //要访问的跨域的api的域名
                target: `${DEV_URL}`,
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
          
        },
    },
    configureWebpack: config => {
        config.resolve = {
            extensions: ['.js', '.vue', '.json', ".css"],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src'),
                'assets': resolve('src/assets'),
                'components': resolve('src/components')
            }
        }
    },
    lintOnSave: undefined
};
