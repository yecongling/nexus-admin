import React, { useCallback, useMemo, useRef } from 'react';
import { Tabs, Dropdown, Button, type TabsProps, type MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useTabStore, type TabItem } from '@/stores/tabStore';
import { useMenuStore } from '@/stores/store';
import { useUserStore } from '@/stores/userStore';
import { getIcon } from '@/utils/utils';
import type { RouteItem } from '@/types/route';
import { DownOutlined } from '@ant-design/icons';
import './tabBar.scss';

interface TabBarProps {
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 使用ref来跟踪是否正在关闭tab，避免useEffect重复执行
  const isClosingTabRef = useRef(false);

  const {
    tabs,
    activeKey,
    setActiveKey,
    removeTab,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTabs,
    reloadTab,
    pinTab,
    unpinTab,
    resetTabs,
    addTab,
    setTabs,
  } = useTabStore();
  const { menus } = useMenuStore();
  const { homePath } = useUserStore();

  // 根据当前路径查找路由信息
  const findRouteByPath = useCallback(
    (path: string): RouteItem | undefined => {
      const searchRoute = (routes: RouteItem[], targetPath: string): RouteItem | undefined => {
        for (const route of routes) {
          if (route.path === targetPath) {
            return route;
          }
          if (route.children) {
            const found = searchRoute(route.children, targetPath);
            if (found) return found;
          }
        }
        return undefined;
      };

      return searchRoute(menus, path);
    },
    [menus],
  );

  // 确保 homePath 对应的 tab 永远在第一个显示且固定
  React.useEffect(() => {
    // 只有在没有tab且有菜单数据且有homePath时才执行
    if (tabs.length === 0 && menus.length > 0 && homePath) {
      // 首先创建homePath的tab（第一个位置）
      const homeRoute = findRouteByPath(homePath);
      if (homeRoute?.path) {
        const homeTabItem: TabItem = {
          key: homePath,
          label: homeRoute.meta?.title || homePath,
          icon: homeRoute.meta?.icon,
          path: homePath,
          closable: false, // 第一个tab不可关闭
          route: homeRoute,
        };

        // 使用头插入，激活 homePath（登录后默认激活首页）
        addTab(homeTabItem, { insertAt: 'head', activate: true });
      }

      // 然后检查当前路径是否有效（在菜单中存在）
      const currentRoute = findRouteByPath(pathname);

      if (currentRoute?.path && pathname !== homePath) {
        // 如果当前路径有效且不是homePath，创建对应的tab
        const currentTabItem: TabItem = {
          key: pathname,
          label: currentRoute.meta?.title || pathname,
          icon: currentRoute.meta?.icon,
          path: pathname,
          closable: true,
          route: currentRoute,
        };

        // 使用尾插入，激活当前页面
        addTab(currentTabItem, { insertAt: 'tail', activate: true });
      } else if (pathname !== homePath) {
        // 如果当前路径无效且不是homePath，跳转到homePath
        navigate(homePath, { replace: true });
      }
    }
  }, [menus, tabs.length, homePath, findRouteByPath, navigate, pathname]);

  // 确保 homePath 对应的 tab 始终存在（即使在其他tab被添加后）
  React.useEffect(() => {
    if (menus.length > 0 && homePath && tabs.length > 0) {
      const homeRoute = findRouteByPath(homePath);
      const homeTabExists = tabs.some((tab) => tab.key === homePath);

      // 如果homePath的tab不存在，需要添加
      if (homeRoute?.path && !homeTabExists) {
        const homeTabItem: TabItem = {
          key: homePath,
          label: homeRoute.meta?.title || homePath,
          icon: homeRoute.meta?.icon,
          path: homePath,
          closable: false, // 第一个tab不可关闭
          route: homeRoute,
        };

        // 使用头插入，不激活，保持当前激活状态
        addTab(homeTabItem, { insertAt: 'head', activate: false });
      }
      // 如果homePath的tab存在但不在第一个位置，需要重新排序
      else if (homeRoute?.path && homeTabExists) {
        const homeTabIndex = tabs.findIndex((tab) => tab.key === homePath);
        // 只有当homePath不在第一个位置时才重新排序，避免不必要的操作
        if (homeTabIndex > 0) {
          const homeTab = tabs[homeTabIndex];
          const otherTabs = tabs.filter((tab) => tab.key !== homePath);
          const newTabs = [homeTab, ...otherTabs];

          // 使用setTabs方法，一次性更新状态
          setTabs(newTabs, activeKey);
        }
      }
    }
  }, [menus, homePath, tabs, findRouteByPath, activeKey]);

  // 当路径变化时，自动添加或激活tab
  React.useEffect(() => {
    // 如果正在关闭tab，跳过执行
    if (isClosingTabRef.current) {
      isClosingTabRef.current = false;
      return;
    }

    if (!pathname || pathname === '/login') return;

    const route = findRouteByPath(pathname);
    if (!route) return;

    const tabItem: TabItem = {
      key: pathname,
      label: route.meta?.title || pathname,
      icon: route.meta?.icon,
      path: pathname,
      closable: true,
      route,
    };

    // 检查tab是否已存在
    const existingTab = tabs.find((tab) => tab.key === pathname);
    if (!existingTab) {
      // 新tab，添加到store
      useTabStore.getState().addTab(tabItem);
    } else {
      // tab已存在，只激活它
      setActiveKey(pathname);
    }
  }, [pathname, findRouteByPath, setActiveKey, tabs]);

  // 监听用户退出登录和页面刷新事件
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // 页面刷新或关闭时清空所有tab
      resetTabs();
    };

    const handleStorageChange = (e: StorageEvent) => {
      // 监听 localStorage 变化，检测用户登录状态变化
      if (e.key === 'user-storage') {
        try {
          const userData = JSON.parse(e.newValue || '{}');
          if (!userData.isLogin) {
            // 用户退出登录，清空所有tab
            resetTabs();
          }
        } catch (error) {
          // 解析失败，忽略
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [resetTabs]);

  // 处理tab切换
  const handleTabChange = useCallback(
    (key: string) => {
      setActiveKey(key);
      // 使用 replace 模式，替换当前历史记录，防止用户通过浏览器后退按钮回到之前的菜单
      navigate(key, { replace: true });
    },
    [setActiveKey, navigate],
  );

  // 处理tab关闭
  const handleTabEdit = useCallback(
    (e: React.Key | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>, action: 'add' | 'remove') => {
      if (action === 'remove' && typeof e === 'string') {
        // 标记正在关闭tab
        isClosingTabRef.current = true;
        const newActiveKey = removeTab(e);
        // 如果关闭的是当前激活的tab，需要跳转到新的激活tab
        if (e === activeKey && newActiveKey) {
          navigate(newActiveKey, { replace: true });
        }
      }
    },
    [removeTab, navigate, activeKey],
  );

  // 右键菜单配置
  const getContextMenu = useCallback(
    (tab: TabItem): MenuProps['items'] => {
      return [
        {
          key: 'close',
          label: t('common.close'),
          icon: <span>✕</span>,
          onClick: () => {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = removeTab(tab.key);
            // 如果关闭的是当前激活的tab，需要跳转到新的激活tab
            if (tab.key === activeKey && newActiveKey) {
              navigate(newActiveKey, { replace: true });
            }
          },
        },
        {
          key: 'pin',
          label: tab.closable ? t('common.pin') : t('common.unpin'),
          icon: <span>📌</span>,
          onClick: () => {
            if (tab.closable) {
              pinTab(tab.key);
            } else {
              unpinTab(tab.key);
            }
          },
        },
        {
          key: 'reload',
          label: t('common.reload'),
          icon: <span>🔄</span>,
          onClick: () => reloadTab(tab.key),
        },
        {
          key: 'openInNewWindow',
          label: t('common.openInNewWindow'),
          icon: <span>⧉</span>,
          onClick: () => {
            window.open(tab.path, '_blank');
          },
        },
        { type: 'divider' },
        {
          key: 'closeLeft',
          label: t('common.closeLeftTabs'),
          icon: <span>◀</span>,
          onClick: () => {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = closeLeftTabs(tab.key);
            // 如果当前激活的tab被关闭了，需要跳转到新的激活tab
            if (newActiveKey && newActiveKey !== activeKey) {
              navigate(newActiveKey, { replace: true });
            }
          },
        },
        {
          key: 'closeRight',
          label: t('common.closeRightTabs'),
          icon: <span>▶</span>,
          onClick: () => {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = closeRightTabs(tab.key);
            // 如果当前激活的tab被关闭了，需要跳转到新的激活tab
            if (newActiveKey && newActiveKey !== activeKey) {
              navigate(newActiveKey, { replace: true });
            }
          },
        },
        {
          key: 'closeOthers',
          label: t('common.closeOtherTabs'),
          icon: <span>❌</span>,
          onClick: () => {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = closeOtherTabs(tab.key);
            // 如果当前激活的tab被关闭了，需要跳转到新的激活tab
            if (newActiveKey && newActiveKey !== activeKey) {
              navigate(newActiveKey, { replace: true });
            }
          },
        },
        {
          key: 'closeAll',
          label: t('common.closeAllTabs'),
          icon: <span>❌</span>,
          onClick: () => {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            closeAllTabs();
            // 关闭所有tab后跳转到首页或登录页
            navigate('/', { replace: true });
          },
        },
      ];
    },
    [t, removeTab, navigate, pinTab, unpinTab, reloadTab, closeLeftTabs, closeRightTabs, closeOtherTabs, closeAllTabs],
  );

  // 右侧下拉菜单配置
  const getRightMenu = useCallback((): MenuProps['items'] => {
    return [
      {
        key: 'close',
        label: t('common.close'),
        icon: <span>✕</span>,
        onClick: () => {
          if (activeKey) {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = removeTab(activeKey);
            // 如果关闭的是当前激活的tab，需要跳转到新的激活tab
            if (newActiveKey) {
              navigate(newActiveKey, { replace: true });
            }
          }
        },
      },
      {
        key: 'pin',
        label: t('common.pin'),
        icon: <span>📌</span>,
        onClick: () => {
          if (activeKey) {
            pinTab(activeKey);
          }
        },
      },
      {
        key: 'reload',
        label: t('common.reload'),
        icon: <span>🔄</span>,
        onClick: () => {
          if (activeKey) {
            reloadTab(activeKey);
          }
        },
      },
      {
        key: 'openInNewWindow',
        label: t('common.openInNewWindow'),
        icon: <span>⧉</span>,
        onClick: () => {
          if (activeKey) {
            window.open(activeKey, '_blank');
          }
        },
      },
      { type: 'divider' },
      {
        key: 'closeLeft',
        label: t('common.closeLeftTabs'),
        icon: <span>◀</span>,
        onClick: () => {
          if (activeKey) {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = closeLeftTabs(activeKey);
            // 如果当前激活的tab被关闭了，需要跳转到新的激活tab
            if (newActiveKey && newActiveKey !== activeKey) {
              navigate(newActiveKey, { replace: true });
            }
          }
        },
      },
      {
        key: 'closeRight',
        label: t('common.closeRightTabs'),
        icon: <span>▶</span>,
        onClick: () => {
          if (activeKey) {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = closeRightTabs(activeKey);
            // 如果当前激活的tab被关闭了，需要跳转到新的激活tab
            if (newActiveKey && newActiveKey !== activeKey) {
              navigate(newActiveKey, { replace: true });
            }
          }
        },
      },
      {
        key: 'closeOthers',
        label: t('common.closeOtherTabs'),
        icon: <span>❌</span>,
        onClick: () => {
          if (activeKey) {
            // 标记正在关闭tab
            isClosingTabRef.current = true;
            const newActiveKey = closeOtherTabs(activeKey);
            // 如果当前激活的tab被关闭了，需要跳转到新的激活tab
            if (newActiveKey && newActiveKey !== activeKey) {
              navigate(newActiveKey, { replace: true });
            }
          }
        },
      },
      {
        key: 'closeAll',
        label: t('common.closeAllTabs'),
        icon: <span>❌</span>,
        onClick: () => {
          // 标记正在关闭tab
          isClosingTabRef.current = true;
          closeAllTabs();
          // 关闭所有tab后跳转到首页或登录页
          navigate('/');
        },
      },
    ];
  }, [
    t,
    activeKey,
    removeTab,
    navigate,
    pinTab,
    reloadTab,
    closeLeftTabs,
    closeRightTabs,
    closeOtherTabs,
    closeAllTabs,
  ]);

  // 构建tab items
  const tabItems = useMemo((): TabsProps['items'] => {
    return tabs.map((tab) => ({
      key: tab.key,
      label: (
        <Dropdown menu={{ items: getContextMenu(tab) }} trigger={['contextMenu']} placement="bottomLeft">
          <div className="flex items-center gap-1">
            <span className="mr-0.5">{tab.icon && getIcon(tab.icon)}</span>
            <span>{t(tab.label)}</span>
          </div>
        </Dropdown>
      ),
      closable: tab.closable && tabs.length > 1, // 只有一个tab时不显示关闭按钮
      children: null, // 内容由KeepAlive组件渲染
    }));
  }, [tabs, getContextMenu]);

  // 如果没有tabs，不渲染组件
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={`tab-bar ${className || ''}`}>
      <div className="tab-bar-content">
        <Tabs
          type="editable-card"
          tabBarGutter={0}
          activeKey={activeKey}
          onChange={handleTabChange}
          onEdit={handleTabEdit}
          items={tabItems}
          size="middle"
          hideAdd
          className="tab-bar-tabs"
          style={{ margin: 0, flex: 1 }}
        />

        {/* 右侧功能区域 */}
        <div className="tab-bar-actions">
          {/* 下拉菜单 */}
          <Dropdown menu={{ items: getRightMenu() }} placement="bottomRight" trigger={['click']}>
            <Button type="text" size="small" icon={<DownOutlined />} className="tab-action-btn" />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
