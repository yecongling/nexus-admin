import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Space, Spin, Tooltip, Tree } from 'antd';
import type React from 'react';
import { useCallback, useEffect, useState, type Key } from 'react';
import { menuService } from '@/services/system/menu/menuApi';
import { transformData } from '@/utils/utils';
import { useTranslation } from 'react-i18next';

/**
 * 菜单树
 * @returns 菜单树
 */
const MenuTree: React.FC<MenuTreeProps> = ({ onSelectMenu, onOpenDrawer }) => {
  // 菜单名称检索（需要按回车的时候才能触发）
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  // 树组件的数据
  const [treeData, setTreeData] = useState<any[]>([]);
  // 展开的节点
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 查询菜单数据
  const { isLoading, data, refetch, isSuccess } = useQuery({
    // 依赖searchText, 当searchText变化时，会重新执行queryFn
    queryKey: ['sys_menu', searchText],
    queryFn: () => menuService.getAllMenus({ name: searchText }),
    enabled: false,
  });

  // 选中菜单树节点
  const onSelect = useCallback(
    (_selectedKeys: Key[], info: any) => {
      onSelectMenu(info.node);
    },
    [onSelectMenu],
  );

  useEffect(() => {
    if (isSuccess) {
      const expanded: string[] = [];
      const result = transformData(data || [], expanded, t);
      setTreeData(result);
      setExpandedKeys(expanded);
    }
  }, [isSuccess, data]);

  // 检索菜单数据
  return (
    <Card
      className="h-full flex flex-col"
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
        <Tree
          className="flex-1 overflow-auto"
          showLine
          blockNode
          showIcon
          treeData={treeData}
          expandedKeys={expandedKeys}
          onSelect={onSelect}
          fieldNames={{title: 'name', key: 'id', children: 'children'}}
        />
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
