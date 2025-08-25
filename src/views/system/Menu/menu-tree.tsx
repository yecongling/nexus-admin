import { CaretDownOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Icon } from '@iconify-icon/react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Space, Spin, Tooltip, Tree, Upload } from 'antd';
import type React from 'react';
import { useCallback, useState, type Key } from 'react';
import { useTranslation } from 'react-i18next';
import { menuService } from '@/services/system/menu/menuApi';
import { transformData } from '@/utils/utils';
import { usePermission } from '@/hooks/usePermission';

/**
 * 菜单树
 * @TODO 要不要支持拖拽排序？？？？？
 * @returns 菜单树
 */
const MenuTree: React.FC<MenuTreeProps> = ({ onSelectMenu, onOpenDrawer }) => {
  // 菜单名称检索（需要按回车的时候才能触发）
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  // 选中的树节点
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  // 新增菜单权限
  const hasAddPermission = usePermission(['system:menu:add']);
  // 批量导入权限
  const hasImportPermission = usePermission(['system:menu:import']);
  // 导出权限
  const hasExportPermission = usePermission(['system:menu:export']);

  // 查询菜单数据
  const { isLoading, data, refetch } = useQuery({
    // 依赖searchText, 当searchText变化时，会重新执行queryFn
    queryKey: ['sys_menu', searchText],
    queryFn: async () => {
      const res = await menuService.getAllMenus(searchText);
      const expanded: string[] = [];
      const result = transformData(res || [], expanded, t);
      if (result.length > 0) {
        setSelectedKeys([result[0].id]);
        onSelectMenu(result[0]);
      }
      return result;
    },
  });

  // 选中菜单树节点
  const onSelect = useCallback(
    (selectedKeys: Key[], info: any) => {
      setSelectedKeys(selectedKeys);
      onSelectMenu(info.node);
    },
    [onSelectMenu],
  );

  /**
   * 导入菜单
   * @param file 导入文件
   */
  const importMenu = useCallback((file: File) => {}, []);

  /**
   * 导出菜单，我可以配置导出所有菜单，或者某个角色的菜单，或者指定一些菜单
   */
  const exportMenu = useCallback(() => {}, []);

  // 检索菜单数据
  return (
    <Card
      className="h-full flex flex-col"
      classNames={{ body: 'flex flex-col h-[calc(100%-58px)] py-0! px-4!', header: 'py-3! px-4!' }}
      title={
        <div className="flex justify-between">
          <div>菜单列表</div>
          <Space>
            {hasAddPermission && (
              <Tooltip title="新增子菜单">
                <Button type="text" icon={<PlusOutlined />} onClick={() => onOpenDrawer(true, 'add')} />
              </Tooltip>
            )}

            {hasImportPermission && (
              <Tooltip title="导入菜单">
                <Upload accept=".xlsx">
                  <Button type="text" icon={<ImportOutlined className="text-blue-500!" />} />
                </Upload>
              </Tooltip>
            )}
            {hasExportPermission && (
              <Tooltip title="导出菜单">
                <Button type="text" icon={<ExportOutlined className="text-orange-500!" />} />
              </Tooltip>
            )}
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
          treeData={data}
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
