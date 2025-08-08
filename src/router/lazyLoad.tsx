import React from 'react';

/**
 * 路由懒加载
 * @param moduleName 模块名
 * @returns
 */

export const LazyLoad = (moduleName: string) => {
  // 文件直接来自 pages 目录，匹配的文件名以 `.tsx` 结尾。
  const viewModule = import.meta.webpackContext('../views', {
    // 是否搜索子目录
    recursive: true,
    // 匹配文件
    regExp: /\.tsx$/,
    // 异步加载
    mode: 'lazy',
  });
  //页面地址
  let URL = '';
  if (moduleName.endsWith('.tsx')) {
    URL = `./${moduleName}`;
  } else {
    URL = `./${moduleName}/index.tsx`;
  }
  //组件地址
  let Module: any;
  try {
    // 检查模块是否存在并动态加载
    if (viewModule.keys().includes(URL)) {
      Module = React.lazy(() => viewModule(URL) as any);
    } else {
      Module = React.lazy(() => import('@/views/error/404'));
    }
  } catch (error) {
    void error;
    // 如果动态加载错误就跳转到错误界面
    Module = React.lazy(() => import('@/views/error/500'));
  }

  return Module;
};