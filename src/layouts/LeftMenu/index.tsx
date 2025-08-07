import type React from 'react';
import { memo } from 'react';
import { Layout } from 'antd';

import './leftMenu.scss';
import { usePreferencesStore } from '@/stores/store';
import SystemLogo from './component/SystemLogo';
import MenuComponent from './component/MenuComponent';

/**
 * 左边的菜单栏
 */
const LeftMenu: React.FC = () => {
  const { sidebar, theme } = usePreferencesStore((state) => ({
    sidebar: state.preferences.sidebar,
    theme: state.preferences.theme,
  }));

  const { collapsed, width } = sidebar;
  let { mode, semiDarkSidebar } = theme;
  if (mode === 'auto') {
    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (semiDarkSidebar) {
    mode = 'dark';
  }

  return (
    <Layout.Sider
      trigger={null}
      collapsedWidth={48}
      className="ant-menu"
      style={{
        overflow: 'hidden',
        position: 'relative',
        transition: 'width .2s cubic-bezier(.34,.69,.1,1)',
        zIndex: 999,
        boxShadow: '0 2px 5px #00000014',
      }}
      collapsible
      width={width}
      theme={mode}
      collapsed={collapsed}
    >
      <SystemLogo />
      <MenuComponent />
    </Layout.Sider>
  );
};

export default memo(LeftMenu);