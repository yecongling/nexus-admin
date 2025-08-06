import type React from 'react';
import { useEffect, useState } from 'react';
import { Layout, Image, Spin, Menu, type MenuProps, Empty } from 'antd';
import { Icon } from '@iconify-icon/react';
import logo from '@/assets/images/icon-192.png';
import { Link, useLocation, useNavigate } from 'react-router';

import './leftMenu.scss';
import type { RouteItem } from '@/types/route';
import { getIcon, getOpenKeys, searchRoute } from '@/utils/utils';
import { useMenuStore, usePreferencesStore } from '@/stores/store';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * 左边的菜单栏
 */
const LeftMenu: React.FC = () => {
  const { preferences } = usePreferencesStore();
  // 从状态库中获取状态
  const { sidebar, theme, navigation, app } = preferences;
  const { accordion } = navigation;
  const { menus } = useMenuStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // 定义一些状态变量
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const { collapsed, width } = sidebar;
  let { mode, semiDarkSidebar, colorPrimary } = theme;
  if (mode === 'auto') {
    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  // 如果深色侧边栏目前也搞成dark
  if (semiDarkSidebar) {
    mode = 'dark';
  }
  const getItem = (
    label: any,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label: t(label),
      type,
    } as MenuItem;
  };

  // 处理后台返回菜单数据
  const deepLoopFloat = (menuList: RouteItem[], newArr: MenuItem[] = []) => {
    for (const item of menuList) {
      // 处理子路由和权限按钮不显示
      if (item?.meta?.menuType === 2 || item?.meta?.menuType === 3 || item?.hidden) {
        continue;
      }
      // 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
      if (!item?.children?.length) {
        newArr.push(getItem(item.meta?.title, item.path, getIcon(item.meta?.icon)));
        continue;
      }
      newArr.push(getItem(item.meta?.title, item.path, getIcon(item.meta?.icon), deepLoopFloat(item.children)));
    }
    return newArr;
  };

  /**
   * 菜单点击跳转
   */
  const clickMenu: MenuProps['onClick'] = ({ key }: { key: string }) => {
    // 配置外置跳转路由
    // if (route.meta.isLink) window.open(route.meta.isLink, "_blank");
    navigate(key);
  };

  // 刷新页面菜单保持高亮
  useEffect(() => {
    const openKey = getOpenKeys(pathname);
    // 判断如果是二级路由，不在左边菜单那种的就不去更新
    const route = searchRoute(pathname, menus);
    if (route && Object.keys(route).length) {
      if (app.dynamicTitle) {
        const title = route.meta?.title;
        if (title) document.title = `Nexus - ${t(title)}`;
      }
      if (!collapsed) setOpenKeys(openKey);
    }
  }, [pathname, collapsed, menus]);

  // 设置当前展开的 subMenu
  const onOpenChange = (openKeys: string[]) => {
    if (!accordion) return setOpenKeys(openKeys);
    if (openKeys.length < 1) return setOpenKeys(openKeys);
    const latestOpenKey = openKeys[openKeys.length - 1];
    if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
    setOpenKeys([latestOpenKey]);
  };

  // 组件挂载加载菜单
  useEffect(() => {
    if (!menus || menus.length === 0) return;
    setLoading(true);
    const menu = deepLoopFloat(menus, []);
    setMenuList(menu);
    setLoading(false);
  }, [menus, t, i18n.language]);

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
      <div className="flex justify-between items-center toolbox">
        <Link to="/" style={{ width: '100%' }}>
          <section className="system-logo h-16 flex items-center shrink-0 box-border">
            <Image
              width={32}
              height={32}
              className="rounded-s-md transition-all duration-200 overflow-hidden shrink-0"
              src={logo}
              preview={false}
            />
            <span className="system-name" style={{ color: colorPrimary }}>
              Nexus Admin
            </span>
          </section>
        </Link>
      </div>
      <Spin
        wrapperClassName="side-menu"
        indicator={<Icon icon="eos-icons:bubble-loading" width={24} />}
        spinning={loading}
        tip="加载中"
      >
        {menuList.length > 0 ? (
          <Menu
            style={{ borderRight: 0 }}
            mode="inline"
            theme={mode}
            defaultSelectedKeys={[pathname]}
            openKeys={openKeys}
            items={menuList}
            onClick={clickMenu}
            onOpenChange={onOpenChange}
          />
        ) : (
          <Empty description={<>暂无菜单，请检查用户角色是否具有菜单！</>} />
        )}
      </Spin>
    </Layout.Sider>
  );
};

export default LeftMenu;
