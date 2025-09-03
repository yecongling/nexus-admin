import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(
      // 目前不能使用react编译器插件，这里使用了装饰器语法不支持导致无法构建包
      // {
      //   babel: {
      //     plugins: ['babel-plugin-react-compiler'],
      //   },
      // },
    ),
    tailwindcss(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    mockDevServerPlugin({
      prefix: '/api',
    }),
  ],
  // 配置分包
  build: {
    // 压缩css代码
    cssCodeSplit: true,
    // js代码压缩，这里开启会出现打包失败（原因是装饰器语法不支持）
    // minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: {
        toplevel: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        // 按文件类型进行拆分文件夹
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // 手动拆分代码
        advancedChunks: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/]react(?:-dom)/,
            },
            {
              name: 'antd',
              test: /node_modules[\\/]antd/,
            },
            {
              name: 'antd-icons',
              test: /node_modules[\\/]@ant-design\/icons/,
            },
            {
              name: 'axios',
              test: /node_modules[\\/]axios/,
            },
          ],
        },
      },
    },
  },
  // 配置路径别名解析
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  // css预处理器
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss";`,
      },
    },
  },
  // 服务器配置以及代理
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:9193',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
