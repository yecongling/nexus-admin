import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Tag, Modal, message, App } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useCallback, useMemo } from 'react';
import type React from 'react';
import {
  permissionService,
  type ButtonInterfacePermission as ButtonInterfacePermissionType,
} from '@/services/system/permission/permissionApi';
import type { TableProps } from 'antd';
import type { InterfacePermission } from '@/services/system/menu/menuApi';

/**
 * 按钮接口权限组件Props
 */
interface ButtonInterfacePermissionProps {
  buttonId: string;
  interfacePermissions: ButtonInterfacePermissionType[];
  onRefresh: () => void;
}

/**
 * 按钮接口权限组件
 * 管理按钮关联的接口权限
 */
const ButtonInterfacePermission: React.FC<ButtonInterfacePermissionProps> = ({
  buttonId,
  interfacePermissions,
  onRefresh,
}) => {
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [availableInterfaces, setAvailableInterfaces] = useState<InterfacePermission[]>([]);
  const [selectedInterfaceIds, setSelectedInterfaceIds] = useState<string[]>([]);

  /**
   * 分配接口权限的mutation
   */
  const assignInterfacesMutation = useMutation({
    mutationFn: (interfaceIds: string[]) => permissionService.assignButtonInterfaces(buttonId, interfaceIds),
    onSuccess: () => {
      message.success('接口权限分配成功');
      queryClient.invalidateQueries({ queryKey: ['button-interfaces', buttonId] });
      onRefresh();
      setAssignModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error.message || '分配失败');
    },
  });

  /**
   * 移除接口权限的mutation
   */
  const removeInterfaceMutation = useMutation({
    mutationFn: (interfaceId: string) => {
      const currentIds = interfacePermissions.map((p) => p.interfaceId);
      const newIds = currentIds.filter((id) => id !== interfaceId);
      return permissionService.assignButtonInterfaces(buttonId, newIds);
    },
    onSuccess: () => {
      message.success('接口权限移除成功');
      queryClient.invalidateQueries({ queryKey: ['button-interfaces', buttonId] });
      onRefresh();
    },
    onError: (error: any) => {
      message.error(error.message || '移除失败');
    },
  });

  /**
   * 处理分配接口权限
   */
  const handleAssignInterfaces = useCallback(() => {
    setAssignModalVisible(true);
    // 这里应该查询可用的接口权限列表
    // 暂时使用空数组，实际应该调用API
    setAvailableInterfaces([]);
  }, []);

  /**
   * 处理确认分配
   */
  const handleConfirmAssign = useCallback(() => {
    if (selectedInterfaceIds.length === 0) {
      message.warning('请选择要分配的接口权限');
      return;
    }

    const currentIds = interfacePermissions.map((p) => p.interfaceId);
    const newIds = [...currentIds, ...selectedInterfaceIds];

    assignInterfacesMutation.mutate(newIds);
  }, [selectedInterfaceIds, interfacePermissions, assignInterfacesMutation]);

  /**
   * 处理移除接口权限
   * @param interfaceId 接口权限ID
   */
  const handleRemoveInterface = useCallback(
    (interfaceId: string) => {
      modal.confirm({
        title: '确认移除',
        content: '确定要移除这个接口权限吗？',
        onOk: () => {
          removeInterfaceMutation.mutate(interfaceId);
        },
      });
    },
    [removeInterfaceMutation],
  );

  /**
   * 处理刷新
   */
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  /**
   * 表格列定义
   */
  const columns: TableProps<ButtonInterfacePermissionType>['columns'] = useMemo(
    () => [
      {
        title: '序号',
        key: 'index',
        width: 80,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: '接口编码',
        dataIndex: 'interfaceCode',
        key: 'interfaceCode',
        render: (code: string) => <Tag color="blue">{code}</Tag>,
      },
      {
        title: '接口描述',
        dataIndex: 'interfaceRemark',
        key: 'interfaceRemark',
        ellipsis: true,
      },
      {
        title: '关联时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveInterface(record.interfaceId)}
            loading={removeInterfaceMutation.isPending}
          >
            移除
          </Button>
        ),
      },
    ],
    [handleRemoveInterface, removeInterfaceMutation.isPending],
  );

  return (
    <div className="h-full flex flex-col">
      {/* 操作栏 */}
      <div className="p-4 border-b border-gray-200">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAssignInterfaces}>
            分配接口权限
          </Button>
          <Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 接口权限列表 */}
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          dataSource={interfacePermissions}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ y: 'calc(100vh - 300px)' }}
          locale={{
            emptyText: '暂无关联的接口权限',
          }}
        />
      </div>

      {/* 分配接口权限弹窗 */}
      <Modal
        title="分配接口权限"
        open={assignModalVisible}
        onOk={handleConfirmAssign}
        onCancel={() => setAssignModalVisible(false)}
        confirmLoading={assignInterfacesMutation.isPending}
        width={600}
      >
        <div className="py-4">
          <p className="text-gray-600 mb-4">选择要分配给此按钮的接口权限：</p>
          {/* 这里应该渲染接口权限选择列表 */}
          <div className="text-center text-gray-400">接口权限选择功能待实现</div>
        </div>
      </Modal>
    </div>
  );
};

export default ButtonInterfacePermission;
