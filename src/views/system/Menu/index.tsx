import { Layout } from 'antd';
import type React from 'react';
import { useCallback, useReducer } from 'react';
import MenuDetailTable from './menu-detail-table';
import MenuInfoDrawer from './menu-info-drawer';
import MenuInterfacePermission from './menu-interface-permission';
import MenuTree from './menu-tree';

/**
 *
 * @returns 菜单
 */
const Menu: React.FC = () => {
  // 合并的状态
  const [state, dispatch] = useReducer((prev: any, action: any) => ({ ...prev, ...action }), {
    // 抽屉是否打开
    openDrawer: false,
    // 当前选中的菜单
    currentMenu: null,
    // 当前的操作
    operation: 'view',
  });

  /**
   * 选择菜单
   * @param menu 菜单
   */
  const onSelectMenu = useCallback((menu: any) => {
    console.log('选中节点', menu);
    dispatch({ currentMenu: menu });
  }, []);

  /**
   * 打开抽屉
   * @param open 是否打开
   */
  const onOpenDrawer = useCallback((open: boolean, operation: string) => {
    dispatch({ openDrawer: open, operation });
  }, []);

  // 新增菜单的mutation

  // 修改菜单的mutation

  // 删除菜单的mutation

  /**
   * 弹窗点击确定的回调函数
   * @param menuData 编辑的菜单数据
   */
  const handleDrawerOk = async (menuData: Record<string, any>) => {
    if (state.currentMenu == null) {
      // 新增数据
    } else {
      // 编辑数据
    }
  };

  return (
    <>
      <Layout>
        <Layout.Sider width={320} theme="light">
          {/* 左边菜单列表 */}
          <MenuTree onSelectMenu={onSelectMenu} onOpenDrawer={onOpenDrawer} />
        </Layout.Sider>
        <Layout.Content className="flex flex-col ml-2 gap-2">
          {/* 菜单详情 */}
          <MenuDetailTable />
          {/* 菜单接口权限列表 */}
          <MenuInterfacePermission />
        </Layout.Content>
      </Layout>
      <MenuInfoDrawer
        menu={state.currentMenu}
        operation={state.operation}
        open={state.openDrawer}
        onOk={handleDrawerOk}
        onClose={onOpenDrawer}
      />
    </>
  );
};

export default Menu;
