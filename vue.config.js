// vue.config.js for less-loader@6.0.0
/*
const path = require('path');
const isProduction = process.env.NODE_ENV !== 'development';

function resolve(dir) {
  return path.join(__dirname, dir)
}*/

const path = require('path');

module.exports = {
    productionSourceMap: false,
    devServer:{
      disableHostCheck: true
    },
    pwa: {
      iconPaths: {
        favicon32: 'favicon.ico',
        favicon16: 'favicon.ico',
        appleTouchIcon: 'favicon.ico',
        maskIcon: 'favicon.ico',
        msTileImage: 'favicon.ico'
      }
    },
    configureWebpack: (config) => {
      config.resolve = { // 配置解析别名
        extensions: ['.js', '.json', '.vue'],
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    },
    /*configureWebpack: config => {
      if (isProduction) {
        // 开启分离js
        config.optimization = {
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 20000,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name (module) {
                  // get the name. E.g. node_modules/packageName/not/this/part.js
                  // or node_modules/packageName
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `npm.${packageName.replace('@', '')}`
                }
              }
            }
          }
        }
      }
    },*/
    
    css: {
      loaderOptions: {
        less: {
          lessOptions: {
            modifyVars: {
            //   'border-radius-base': '24px',
              'btn-border-radius-base': '24px',
              'primary-color': '#5971C9',
            //   'link-color': '#9feaf9',
              'card-radius': '8px',
              'border-color-split': '#dadce0',
            // 'border-width-base': '2px',
            //   'menu-dark-bg': '#2f3241',
              'heading-color' : 'rgba(0, 0, 0, 0.85)', // 标题色
              'text-color': 'rgba(0, 0, 0, 0.75)', // 主文本色
              'text-color-secondary': 'rgba(0, 0, 0, 0.65)', // 次文本色
              'statistic-unit-font-size': '18px',// a-statistic 次标题文本大小
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    /*chainWebpack: config => {
      config.resolve.alias
        .set('@', resolve('src'))
    },*/
  };