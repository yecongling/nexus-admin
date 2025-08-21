import { Layout } from 'antd';
import type React from 'react';
import { useCallback, useState } from 'react';
import MenuDetailTable from './menu-detail-table';
import MenuInterfacePermission from './menu-interface-permission';
import MenuTree from './menu-tree';

/**
 *
 * @returns 菜单
 */
const Menu: React.FC = () => {
  // 当前选中的菜单项
  const [selectedMenu, setSelectedMenu] = useState();
  // 编辑抽屉是否打开
  const [openDrawer, setOpenDrawer] = useState(false);

  /**
   * 选择菜单
   * @param menu 菜单
   */
  const onSelectMenu = useCallback((menu: any) => {

  }, []);

  /**
   * 打开抽屉
   * @param open 是否打开
   */
  const onOpenDrawer = useCallback((open: boolean) => {
    setOpenDrawer(open);
  }, []);

  return (
    <Layout>
      <Layout.Sider width={320} theme='light'>
        {/* 左边菜单列表 */}
        <MenuTree onSelectMenu={onSelectMenu} onOpenDrawer={onOpenDrawer} />
      </Layout.Sider>
      <Layout.Content className='flex flex-col ml-2 gap-2'>
        {/* 菜单详情 */}
        <MenuDetailTable />
        {/* 菜单接口权限列表 */}
        <MenuInterfacePermission />
      </Layout.Content>
    </Layout>
  );
};

export default Menu;
