import { CaretDownOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Icon } from '@iconify-icon/react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Space, Spin, Tooltip, Tree } from 'antd';
import type React from 'react';
import { useCallback, useEffect, useState, type Key } from 'react';
import { useTranslation } from 'react-i18next';
import { menuService } from '@/services/system/menu/menuApi';
import { transformData } from '@/utils/utils';

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
  // 选中的树节点
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  // 查询菜单数据
  const { isLoading, data, refetch, isSuccess } = useQuery({
    // 依赖searchText, 当searchText变化时，会重新执行queryFn
    queryKey: ['sys_menu', searchText],
    queryFn: menuService.getAllMenus,
  });

  // 选中菜单树节点
  const onSelect = useCallback(
    (selectedKeys: Key[], info: any) => {
      setSelectedKeys(selectedKeys);
      onSelectMenu(info.node);
    },
    [onSelectMenu],
  );

  useEffect(() => {
    if (isSuccess) {
      const expanded: string[] = [];
      const result = transformData(data || [], expanded, t);
      if (result.length > 0) {
        setSelectedKeys([result[0].id]);
        onSelectMenu(result[0]);
      }
      setTreeData(result);
    }
  }, [isSuccess, data]);

  // 检索菜单数据
  return (
    <Card
      className="h-full flex flex-col"
      classNames={{ body: 'flex flex-col h-[calc(100%-58px)] py-0! px-4!', header: 'py-3! px-4!' }}
      title={
        <div className="flex justify-between">
          <div>菜单列表</div>
          <Space>
            <Tooltip title="新增子菜单">
              <Button type="text" icon={<PlusOutlined />} onClick={() => onOpenDrawer(true, 'add')} />
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
        onChange={(e) => setSearchText(e.target.value)}
        enterButton
        onSearch={() => refetch()}
        className="my-2"
      />
      {isLoading ? (
        <Spin indicator={<Icon icon="eos-icons:bubble-loading" width={24} />} />
      ) : (
        <Tree
          showLine
          blockNode
          showIcon
          rootClassName="flex-1 overflow-auto my-2!"
          treeData={treeData}
          defaultExpandAll
          selectedKeys={selectedKeys}
          switcherIcon={<CaretDownOutlined style={{ fontSize: '14px' }} />}
          onSelect={onSelect}
          fieldNames={{ title: 'name', key: 'id', children: 'children' }}
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
   * @param operation 操作
   */
  onOpenDrawer: (open: boolean, operation: string) => void;
};
