import path from 'node:path';
import { pluginHtmlMinifierTerser } from 'rsbuild-plugin-html-minifier-terser';
import { pluginMockServer } from 'rspack-plugin-mock/rsbuild';
import { defineConfig } from '@rsbuild/core';
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginSass } from '@rsbuild/plugin-sass';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [
    // 表示将react和router相关的包拆分为单独的chunk
    pluginReact({
      splitChunks: {
        react: true,
        router: true,
      },
    }),
    // 将SVG转换为React组件
    pluginSvgr(),
    pluginSass({
      // sass文件默认注入全局的变量文件
      sassLoaderOptions: {
        additionalData: `@use 'src/styles/variables.scss' as *;`,
      },
    }),
    // mock 插件
    pluginMockServer({
      // 表示拦截以路径/api开头的
      prefix: '/api',
    }),
    // 启动图片压缩
    pluginImageCompress(),
    // 启动html压缩
    pluginHtmlMinifierTerser(),
  ],
  // 配置html模板
  html: {
    template: './index.html',
  },
  // 配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 将三方依赖中对lodash的依赖重定向到lodash-es
      lodash: 'lodash-es',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    // 通过rsdcotor分析出来的打包时重复包
    dedupe: ['@babel/runtime', 'tslib', 'rc-switch', 'rc-checkbox', 'clsx'],
  },
  dev: {
    // 按需编译
    lazyCompilation: true,
  },
  // 构建产物相关配置
  output: {
    sourceMap: {
      js: isDev ? 'eval' : false, // 开发环境开启js的sourceMap
    },
  },
  source: {
    // 配置装饰器语法用于支持@injectable()和@inject装饰器
    decorators: {
      version: 'legacy',
    },
  },

  // 构建优化相关
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      // 下面的部分单独分包(这里暂时不分包-原因是：后续的测试中发现不配置下面的选项页面加载反而更快)
      forceSplitting: {
        axios: /node_modules[\\/]axios/,
        antd: /node_modules[\\/]antd/,
        //   echarts: /node_modules[\\/]echarts/,
        //   zrender: /node_modules[\\/]zrender/,
        antdIcons: /node_modules[\\/]@ant-design\/icons/,
        'rc-cp': /node_modules[\\/]rc-/,
      },
    },
    // 启用构建缓存
    buildCache: !isDev,
    // 移除console.[method]语句
    removeConsole: true,
    // 开启包文件分析
    // bundleAnalyze: {},
  },
  // 服务相关
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:9193',
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
