import React, { useCallback, useMemo } from 'react';
import { Tabs, Dropdown, Button, type TabsProps, type MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useTabStore, type TabItem } from '@/stores/tabStore';
import { useMenuStore } from '@/stores/store';
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
  } = useTabStore();
  const { menus } = useMenuStore();

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

  // 当路径变化时，自动添加或激活tab
  React.useEffect(() => {
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
  }, [pathname, findRouteByPath, tabs, setActiveKey]);

  // 处理tab切换
  const handleTabChange = useCallback(
    (key: string) => {
      setActiveKey(key);
      navigate(key);
    },
    [setActiveKey, navigate],
  );

  // 处理tab关闭
  const handleTabEdit = useCallback(
    (e: React.Key | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>, action: 'add' | 'remove') => {
      if (action === 'remove' && typeof e === 'string') {
        const newActiveKey = removeTab(e);
        // 如果关闭的是当前激活的tab，需要跳转到新的激活tab
        if (e === activeKey && newActiveKey) {
          navigate(newActiveKey);
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
            const newActiveKey = removeTab(tab.key);
            // 如果关闭的是当前激活的tab，需要跳转到新的激活tab
            if (tab.key === activeKey && newActiveKey) {
              navigate(newActiveKey);
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
          key: 'maximize',
          label: t('common.maximize'),
          icon: <span>⛶</span>,
          onClick: () => {
            // 这里可以实现最大化功能
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
          onClick: () => closeLeftTabs(tab.key),
        },
        {
          key: 'closeRight',
          label: t('common.closeRightTabs'),
          icon: <span>▶</span>,
          onClick: () => closeRightTabs(tab.key),
        },
        {
          key: 'closeOthers',
          label: t('common.closeOtherTabs'),
          icon: <span>❌</span>,
          onClick: () => closeOtherTabs(tab.key),
        },
        {
          key: 'closeAll',
          label: t('common.closeAllTabs'),
          icon: <span>⫷</span>,
          onClick: () => closeAllTabs(),
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
            const newActiveKey = removeTab(activeKey);
            // 如果关闭的是当前激活的tab，需要跳转到新的激活tab
            if (newActiveKey) {
              navigate(newActiveKey);
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
        key: 'maximize',
        label: t('common.maximize'),
        icon: <span>⛶</span>,
        onClick: () => {
          // 这里可以实现最大化功能
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
            closeLeftTabs(activeKey);
          }
        },
      },
      {
        key: 'closeRight',
        label: t('common.closeRightTabs'),
        icon: <span>▶</span>,
        onClick: () => {
          if (activeKey) {
            closeRightTabs(activeKey);
          }
        },
      },
      {
        key: 'closeOthers',
        label: t('common.closeOtherTabs'),
        icon: <span>❌</span>,
        onClick: () => {
          if (activeKey) {
            closeOtherTabs(activeKey);
          }
        },
      },
      {
        key: 'closeAll',
        label: t('common.closeAllTabs'),
        icon: <span>⫷</span>,
        onClick: () => closeAllTabs(),
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
            <span className='mr-0.5'>{tab.icon && getIcon(tab.icon)}</span>
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
          tabBarGutter={4}
          activeKey={activeKey}
          onChange={handleTabChange}
          onEdit={handleTabEdit}
          items={tabItems}
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
