import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Space, Spin, Tooltip, Tree } from 'antd';
import type React from 'react';
import { useState } from 'react';
import { menuService } from '@/services/system/menu/menuApi';

/**
 * 菜单树
 * @returns 菜单树
 */
const MenuTree: React.FC<MenuTreeProps> = ({ onSelectMenu, onOpenDrawer }) => {
  // 菜单名称检索（需要按回车的时候才能触发）
  const [searchText, setSearchText] = useState('');

  // 查询菜单数据
  const { isLoading, data, refetch } = useQuery({
    // 依赖searchText, 当searchText变化时，会重新执行queryFn
    queryKey: ['sys_menu', searchText],
    queryFn: () => menuService.getAllMenus({ menuName: searchText }),
    enabled: false,
  });

  // 检索菜单数据
  return (
    <Card
      className='h-full flex flex-col'
      classNames={{ body: 'flex flex-col flex-1 py-0! px-4!', header: 'py-3! px-4!' }}
      title={
        <div className="flex justify-between">
          <div>菜单列表</div>
          <Space>
            <Tooltip title="新增菜单">
              <Button type="text" icon={<PlusOutlined />} onClick={() => onOpenDrawer(true)} />
            </Tooltip>
            <Tooltip title="刷新">
              <Button type="text" icon={<ReloadOutlined />} onClick={() => refetch()} />
            </Tooltip>
          </Space>
        </div>
      }
    >
      <Input.Search
        placeholder="请输入菜单名称"
        allowClear
        enterButton
        value={searchText}
        onSearch={setSearchText}
        className="my-2"
      />
      {isLoading ? (
        <Spin tip="数据加载中" />
      ) : (
        <Tree className="flex-1 overflow-auto" showLine blockNode treeData={data || []} />
      )}
    </Card>
  );
};

export default MenuTree;

export type MenuTreeProps = {
  /**
   * 选择菜单
   * @param menu 菜单
   */
  onSelectMenu: (menu: any) => void;

  /**
   * 打开抽屉
   * @param open 是否打开
   */
  onOpenDrawer: (open: boolean) => void;
};
