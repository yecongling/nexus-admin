import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Tree, Button, Space, message, Spin, Tabs } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useCallback, useMemo } from 'react';
import type React from 'react';
import { permissionService } from '@/services/system/permission/permissionApi';
import { menuService } from '@/services/system/menu/menuApi';
import type { TreeProps } from 'antd';

/**
 * 角色权限分配组件Props
 */
interface RolePermissionAssignProps {
  roleId: string;
  onComplete: () => void;
}

/**
 * 树节点数据类型
 */
interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  isLeaf?: boolean;
  permissionType?: 'menu' | 'button' | 'interface';
}

/**
 * 角色权限分配组件
 * 为角色分配菜单权限、按钮权限和接口权限
 */
const RolePermissionAssign: React.FC<RolePermissionAssignProps> = ({ roleId, onComplete }) => {
  const queryClient = useQueryClient();
  const [checkedKeys, setCheckedKeys] = useState<{
    menu: string[];
    button: string[];
    interface: string[];
  }>({
    menu: [],
    button: [],
    interface: [],
  });
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'button' | 'interface'>('menu');

  /**
   * 查询角色当前权限
   */
  const { data: rolePermissions, isLoading: rolePermissionsLoading } = useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: () => permissionService.getRolePermissionDetail(roleId),
    enabled: !!roleId,
  });

  /**
   * 查询菜单树数据
   */
  const { data: menuTreeData, isLoading: menuLoading } = useQuery({
    queryKey: ['menu-tree'],
    queryFn: () => menuService.getAllMenus({}),
  });

  /**
   * 查询权限按钮列表
   */
  const { data: buttonListData, isLoading: buttonLoading } = useQuery({
    queryKey: ['permission-buttons'],
    queryFn: () => permissionService.getButtonList({ pageSize: 1000 }),
  });

  /**
   * 分配权限的mutation
   */
  const assignPermissionMutation = useMutation({
    mutationFn: ({
      permissionType,
      permissionIds,
    }: {
      permissionType: 'menu' | 'button' | 'interface';
      permissionIds: string[];
    }) => permissionService.assignRolePermission(roleId, permissionType, permissionIds),
    onSuccess: () => {
      message.success('权限分配成功');
      queryClient.invalidateQueries({ queryKey: ['role-permissions', roleId] });
      onComplete();
    },
    onError: (error: any) => {
      message.error(error.message || '权限分配失败');
    },
  });

  /**
   * 初始化选中的权限
   */
  useMemo(() => {
    if (rolePermissions) {
      setCheckedKeys({
        menu: rolePermissions.menuPermissions || [],
        button: rolePermissions.buttonPermissions || [],
        interface: rolePermissions.interfacePermissions || [],
      });
    }
  }, [rolePermissions]);

  /**
   * 构建菜单树数据
   */
  const menuTreeNodes = useMemo(() => {
    if (!menuTreeData) return [];

    const buildTree = (menus: any[], parentId?: string): TreeNode[] => {
      return menus
        .filter((menu) => menu.parentId === parentId)
        .map((menu) => ({
          key: menu.id,
          title: menu.name,
          permissionType: 'menu' as const,
          children: buildTree(menus, menu.id),
        }));
    };

    return buildTree(menuTreeData);
  }, [menuTreeData]);

  /**
   * 构建按钮树数据
   */
  const buttonTreeNodes = useMemo(() => {
    if (!buttonListData?.records) return [];

    // 按菜单分组按钮
    const menuGroups = buttonListData.records.reduce(
      (acc, button) => {
        const menuId = button.parentMenuId || 'root';
        if (!acc[menuId]) {
          acc[menuId] = {
            menuId,
            menuName: button.parentMenuName || '根菜单',
            buttons: [],
          };
        }
        acc[menuId].buttons.push(button);
        return acc;
      },
      {} as Record<string, { menuId: string; menuName: string; buttons: any[] }>,
    );

    return Object.values(menuGroups).map((group) => ({
      key: group.menuId,
      title: group.menuName,
      children: group.buttons.map((button) => ({
        key: button.id,
        title: button.name,
        permissionType: 'button' as const,
        isLeaf: true,
      })),
    }));
  }, [buttonListData?.records]);

  /**
   * 处理树节点选中
   * @param checkedKeysValue 选中的节点keys
   */
  const handleCheck: TreeProps['onCheck'] = useCallback(
    (checkedKeysValue: any) => {
      const keys = checkedKeysValue as string[];
      setCheckedKeys((prev) => ({
        ...prev,
        [activeTab]: keys,
      }));
    },
    [activeTab],
  );

  /**
   * 处理树节点展开
   * @param keys 展开的节点keys
   */
  const handleExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys as string[]);
  }, []);

  /**
   * 处理保存权限
   */
  const handleSavePermissions = useCallback(() => {
    const permissionIds = checkedKeys[activeTab];
    assignPermissionMutation.mutate({
      permissionType: activeTab,
      permissionIds,
    });
  }, [checkedKeys, activeTab, assignPermissionMutation]);

  /**
   * 处理刷新
   */
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['role-permissions', roleId] });
  }, [queryClient, roleId]);

  /**
   * 获取当前Tab的树数据
   */
  const getCurrentTreeData = () => {
    switch (activeTab) {
      case 'menu':
        return menuTreeData ? menuTreeNodes : [];
      case 'button':
        return buttonListData?.records ? buttonTreeNodes : [];
      case 'interface':
        return []; // 接口权限树数据待实现
      default:
        return [];
    }
  };

  /**
   * 获取当前Tab的加载状态
   */
  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'menu':
        return menuLoading;
      case 'button':
        return buttonLoading;
      case 'interface':
        return false;
      default:
        return false;
    }
  };

  const currentTreeData = getCurrentTreeData();
  const currentLoading = getCurrentLoading();

  return (
    <div className="h-full flex flex-col">
      {/* Tab切换 */}
      <Card size="small" className="mb-4">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'menu' | 'button' | 'interface')}
          items={[
            {
              key: 'menu',
              label: '菜单权限',
            },
            {
              key: 'button',
              label: '按钮权限',
            },
            {
              key: 'interface',
              label: '接口权限',
            },
          ]}
        />
      </Card>

      {/* 权限树 */}
      <div className="flex-1">
        <Card
          title={`${activeTab === 'menu' ? '菜单' : activeTab === 'button' ? '按钮' : '接口'}权限分配`}
          size="small"
          className="h-full"
          extra={
            <Space>
              <Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh} loading={rolePermissionsLoading}>
                刷新
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSavePermissions}
                loading={assignPermissionMutation.isPending}
              >
                保存权限
              </Button>
            </Space>
          }
        >
          {currentLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <Tree
              checkable
              checkedKeys={checkedKeys[activeTab]}
              onCheck={handleCheck}
              onExpand={handleExpand}
              expandedKeys={expandedKeys}
              treeData={currentTreeData}
              showLine
              showIcon={false}
              className="permission-assign-tree"
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default RolePermissionAssign;
