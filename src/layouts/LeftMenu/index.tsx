import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Layout,
  Image,
  Spin,
  Menu,
  type MenuProps,
  Button,
  Divider,
  Space,
  Segmented,
  Tooltip,
  ConfigProvider,
  Empty,
} from 'antd';
import logo from '@/assets/images/icon-192.png';
import { Link, useLocation, useNavigate } from 'react-router';

import './leftMenu.scss';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SunOutlined,
} from '@ant-design/icons';
import type { RouteItem } from '@/types/route';
import { getIcon, getOpenKeys, searchRoute } from '@/utils/utils';
import { useMenuStore, usePreferencesStore } from '@/stores/store';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * 左边的菜单栏
 */
const LeftMenu: React.FC = memo(() => {
  const { preferences, updatePreferences } = usePreferencesStore();
  // 从状态库中获取状态
  const { sidebar, theme, navigation, app } = preferences;
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
  // 是否暗黑模式
  const isDark = useMemo(() => {
    return mode === 'dark' || semiDarkSidebar;
  }, [mode, semiDarkSidebar]);

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
  const deepLoopFloat = useCallback(
    (menuList: RouteItem[], newArr: MenuItem[] = []) => {
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
    },
    [menuList],
  );

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
        overflowX: 'hidden',
        zIndex: 999,
        boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.08)',
      }}
      collapsible
      width={width}
      theme={mode}
      collapsed={collapsed}
    >
      <div className="flex justify-between items-center toolbox">
        <Link to="/" style={{ width: '100%' }}>
          <div className="h-16 flex items-center justify-center">
            <Image width={25} src={logo} preview={false} />
            {!collapsed && (
              <p
                style={{
                  fontWeight: 'bold',
                  margin: '0 12px',
                  fontSize: '20px',
                  color: colorPrimary,
                }}
              >
                Nexus
              </p>
            )}
          </div>
        </Link>
      </div>
      <Spin wrapperClassName="side-menu" spinning={loading} tip="加载中">
        {menuList.length > 0 ? (
          <Menu
            mode="inline"
            theme={mode}
            defaultSelectedKeys={[pathname]}
            openKeys={navigation.accordion ? openKeys : undefined}
            items={menuList}
            onClick={clickMenu}
            onOpenChange={onOpenChange}
          />
        ) : (
          <Empty description={<>暂无菜单，请检查用户角色是否具有菜单！</>} />
        )}
      </Spin>
      <Divider style={{ margin: '8px 0' }} />
      <div
        className="flex justify-center content-center"
        style={{
          height: collapsed ? '140px' : '40px',
        }}
      >
        <Space direction={collapsed ? 'vertical' : 'horizontal'} align="center" className="justify-center">
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  itemHoverColor: isDark ? '#eee' : 'rgba(0,0,0,0.88)',
                  itemColor: isDark ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                  itemSelectedBg: isDark ? colorPrimary : '#fff',
                  itemSelectedColor: isDark ? '#fff' : 'rgba(0,0,0,0.88)',
                  trackBg: isDark ? '#001529' : '#f5f5f5',
                },
              },
            }}
          >
            <Segmented
              onChange={(value) => updatePreferences('theme', 'mode', value)}
              vertical={collapsed}
              size="small"
              options={[
                {
                  label: collapsed ? '' : 'light',
                  value: 'light',
                  icon: <SunOutlined />,
                },
                {
                  label: collapsed ? '' : 'dark',
                  value: 'dark',
                  icon: <MoonOutlined />,
                },
              ]}
            />
          </ConfigProvider>
          <Tooltip title="帮助文档">
            <Button
              size="small"
              color="default"
              variant="filled"
              shape="circle"
              icon={<QuestionCircleOutlined style={{ color: isDark ? 'white' : 'black' }} />}
            />
          </Tooltip>
          <Button
            size="small"
            color="default"
            variant="filled"
            shape="circle"
            style={{
              cursor: 'pointer',
              fontSize: '16px',
            }}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: isDark ? 'white' : 'black' }} />
              ) : (
                <MenuFoldOutlined style={{ color: isDark ? 'white' : 'black' }} />
              )
            }
            onClick={() => updatePreferences('sidebar', 'collapsed', !collapsed)}
          />
        </Space>
      </div>
    </Layout.Sider>
  );
});

export default LeftMenu;
