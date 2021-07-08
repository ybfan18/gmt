// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {
    dark: true
  },
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  disableDynamicImport: false,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/gmtweb/',
  },
  define: {
    PATH: 'http://13.250.119.166:8088/gmt',
    // PATH: '/gmt'
  },
  esbuild: {},
  // base: '/gmtweb',   //定义路由的基本路径
  publicPath: '/gmtweb/',  //定义资源的基本路径
  chunks: ['vendors', 'umi'],
  chainWebpack(config) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 2,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test: /^.*node_modules[\\/](?!ag-grid-|lodash|rc-select|rc-time-picker|antd-mobile).*$/,
              chunks: "all",
              priority: -10,
            },
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
    });
    //过滤掉momnet的那些不使用的国际化文件
    config.plugin("replace").use(require("webpack").ContextReplacementPlugin).tap(() => {
      return [/moment[/\\]locale$/, /zh-cn|en-us/];
    });
  },
  externals: {
    "bizcharts": "BizCharts",
    // 以下配置为BizCharts依赖的第三方库，需要同时提供
    "react": "React",
    "react-dom": "ReactDOM",
  },
  scripts: [
    "https://g.alicdn.com/code/lib/react/16.14.0/umd/react.production.min.js",
    "https://g.alicdn.com/code/lib/react-dom/17.0.0/umd/react-dom.production.min.js",
    "https://cdn.bootcdn.net/ajax/libs/bizcharts/4.1.10-beta.1/BizCharts.min.js"
  ],
});
