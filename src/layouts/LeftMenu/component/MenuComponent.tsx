import { memo, useCallback, useEffect, useState } from 'react';
import { Empty, Menu, Spin, type MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify-icon/react';
import { useMenuStore, usePreferencesStore } from '@/stores/store';
import { getIcon, getOpenKeys, searchRoute } from '@/utils/utils';
import type { RouteItem } from '@/types/route';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * 菜单组件
 * @returns
 */
const MenuComponent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menus = useMenuStore((state) => state.menus);
  const { accordion, dynamicTitle } = usePreferencesStore((state) => ({
    accordion: state.preferences.navigation.accordion,
    dynamicTitle: state.preferences.app.dynamicTitle,
  }));
  const mode = usePreferencesStore((state) => {
    let mode = state.preferences.theme.mode;
    if (mode === 'auto') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (state.preferences.theme.semiDarkSidebar) {
      mode = 'dark';
    }
    return mode;
  });

  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

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

  const deepLoopFloat = useCallback((menuList: RouteItem[], newArr: MenuItem[] = []) => {
    for (const item of menuList) {
      if (item?.meta?.menuType === 2 || item?.meta?.menuType === 3 || item?.hidden) {
        continue;
      }
      if (!item?.children?.length) {
        newArr.push(getItem(item.meta?.title, item.path, getIcon(item.meta?.icon)));
        continue;
      }
      newArr.push(getItem(item.meta?.title, item.path, getIcon(item.meta?.icon), deepLoopFloat(item.children)));
    }
    return newArr;
  }, []);

  const clickMenu: MenuProps['onClick'] = ({ key }: { key: string }) => {
    navigate(key);
  };

  useEffect(() => {
    const openKey = getOpenKeys(pathname);
    const route = searchRoute(pathname, menus);
    if (route && Object.keys(route).length) {
      if (dynamicTitle) {
        const title = route.meta?.title;
        if (title) document.title = `Nexus - ${t(title)}`;
      }
      setOpenKeys(openKey);
    }
  }, [pathname, menus, dynamicTitle, t]);

  const onOpenChange = (openKeys: string[]) => {
    if (!accordion) return setOpenKeys(openKeys);
    if (openKeys.length < 1) return setOpenKeys(openKeys);
    const latestOpenKey = openKeys[openKeys.length - 1];
    if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
    setOpenKeys([latestOpenKey]);
  };

  useEffect(() => {
    if (!menus || menus.length === 0) return;
    setLoading(true);
    const menu = deepLoopFloat(menus, []);
    setMenuList(menu);
    setLoading(false);
  }, [menus, t, i18n.language, deepLoopFloat]);

  return (
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
  );
};

export default memo(MenuComponent);