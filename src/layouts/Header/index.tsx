import { Badge, Dropdown, FloatButton, Layout, type MenuProps, Skeleton, Space, Tooltip } from 'antd';
import React, { memo, useState, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BellOutlined,
  GithubOutlined,
  LockOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { languages } from '@/locales/language';
import { MyIcon } from '@/components/MyIcon';
import { changeLanguage } from '@/locales/i18next-config';
import { usePreferencesStore } from '@/stores/store';
import BreadcrumbNav from './component/BreadcrumbNav';
import FullScreen from './component/FullScreen';
import MessageBox from './component/MessageBox';
import UserDropdown from './component/UserDropdown';
import LayoutMenu from '../menu';
import SearchMenuModal from './component/SearchMenuModal';

const Setting = React.lazy(() => import('./component/Setting'));

/**
 * 顶部布局内容
 */
const Header: React.FC = memo(() => {
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  // 从全局状态中获取配置是否开启面包屑、图标
  const { preferences, updatePreferences } = usePreferencesStore();
  const { breadcrumb, header, app, theme } = preferences;
  const { t } = useTranslation();

  // 显示顶部菜单
  const showHeaderNav = useMemo(() => {
    return app.layout === 'header-nav' || app.layout === 'mixed-nav' || app.layout === 'header-mixed-nav';
  }, [app.layout]);

  // 顶部菜单主题
  const themeHeader = useMemo(() => {
    return theme.semiDarkHeader ? 'dark' : 'light';
  }, [theme.semiDarkHeader]);

  /**
   * 跳转到github
   */
  const routeGitHub = () => {
    window.open('https://github.com/yecongling/nexus-web', '_blank');
  };

  /**
   * 下拉语言选项
   */
  const menuItems: MenuProps['items'] = languages.map((item: any) => ({
    key: item.value,
    label: item.name,
    onClick: () => changeLocale(item.value),
  }));

  /**
   * 切换语言
   * @param locale 语言
   */
  const changeLocale = (locale: string) => {
    updatePreferences('app', 'locale', locale);
    changeLanguage(locale);
  };

  return (
    <>
      {header.enable ? (
        <Layout.Header
          className="ant-layout-header flex"
          style={{
            borderBottom: ' 1px solid #e9edf0',
          }}
        >
          {/* 面包屑 */}
          {breadcrumb.enable && <BreadcrumbNav />}
          {/* 显示头部横向的菜单 */}
          <div className={`menu-align-${header.menuAlign} flex h-full min-w-0 flex-1 items-center`}>
            {showHeaderNav && <LayoutMenu className="w-full" mode="horizontal" theme={themeHeader} />}
          </div>
          <Space size="large" className="flex justify-end items-center toolbox">
            <SearchMenuModal />
            <Tooltip placement="bottom" title="github">
              <GithubOutlined style={{ cursor: 'pointer', fontSize: '18px' }} onClick={routeGitHub} />
            </Tooltip>
            <Tooltip placement="bottom" title={t('layout.header.lock')}>
              <LockOutlined
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => {
                  updatePreferences('widget', 'lockScreenStatus', true);
                }}
              />
            </Tooltip>
            {/* 邮件 */}
            <Badge count={5}>
              <MailOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />
            </Badge>
            <Dropdown placement="bottom" popupRender={() => <MessageBox />}>
              <Badge count={5}>
                <BellOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />
              </Badge>
            </Dropdown>
            <Tooltip placement="bottomRight" title={t('layout.header.setting')}>
              <SettingOutlined style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setOpenSetting(true)} />
            </Tooltip>
            <Dropdown menu={{ items: menuItems }} placement="bottom">
              <MyIcon type="fusion-language" style={{ cursor: 'pointer', fontSize: '18px' }} />
            </Dropdown>
            <FullScreen />
            {/* 用户信息 */}
            <UserDropdown />
          </Space>
        </Layout.Header>
      ) : (
        <FloatButton
          icon={<SettingOutlined />}
          tooltip={<span>{t('layout.header.setting')}</span>}
          style={{ right: 24, bottom: 24 }}
          onClick={() => setOpenSetting(true)}
        />
      )}
      {/* 系统设置界面 */}
      <Suspense fallback={<Skeleton />}>
        <Setting open={openSetting} setOpen={setOpenSetting} />
      </Suspense>
    </>
  );
});
export default Header;
