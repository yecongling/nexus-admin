import { useQuery } from '@tanstack/react-query';
import { Tree, Spin, Empty } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import type React from 'react';
import { menuService } from '@/services/system/menu/menuApi';
import type { TreeProps } from 'antd';

/**
 * 菜单权限树组件Props
 */
interface MenuPermissionTreeProps {
  checkedKeys: string[];
  onCheck: (checkedKeys: string[]) => void;
}

/**
 * 树节点数据类型
 */
interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  isLeaf?: boolean;
}

/**
 * 菜单权限树组件
 * 以树形结构展示菜单权限分配
 */
const MenuPermissionTree: React.FC<MenuPermissionTreeProps> = ({
  checkedKeys,
  onCheck,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  /**
   * 查询菜单树数据
   */
  const { data: menuList, isLoading } = useQuery({
    queryKey: ['menu-tree'],
    queryFn: () => menuService.getAllMenus({}),
  });

  /**
   * 构建树形数据
   */
  const treeData = useMemo(() => {
    if (!menuList) return [];

    const buildTree = (menus: any[], parentId?: string): TreeNode[] => {
      return menus
        .filter(menu => menu.parentId === parentId)
        .map(menu => ({
          key: menu.id,
          title: menu.name,
          children: buildTree(menus, menu.id),
        }));
    };

    return buildTree(menuList);
  }, [menuList]);

  /**
   * 处理树节点选中
   * @param checkedKeysValue 选中的节点keys
   */
  const handleCheck: TreeProps['onCheck'] = useCallback((checkedKeysValue) => {
    const keys = checkedKeysValue as string[];
    onCheck(keys);
  }, [onCheck]);

  /**
   * 处理树节点展开
   * @param keys 展开的节点keys
   */
  const handleExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys as string[]);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!treeData.length) {
    return (
      <Empty
        description="暂无菜单数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="mt-8"
      />
    );
  }

  return (
    <div className="h-full overflow-auto">
      <Tree
        checkable
        checkedKeys={checkedKeys}
        onCheck={handleCheck}
        onExpand={handleExpand}
        expandedKeys={expandedKeys}
        treeData={treeData}
        showLine
        showIcon={false}
        className="menu-permission-tree"
      />
    </div>
  );
};

export default MenuPermissionTree;
