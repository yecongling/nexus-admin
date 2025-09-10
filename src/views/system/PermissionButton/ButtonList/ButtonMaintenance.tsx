import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Tag, Modal, message, App, Popconfirm, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useCallback, useMemo } from 'react';
import type React from 'react';
import {
  permissionService,
  type PermissionButton,
  type ButtonSearchParams,
} from '@/services/system/permission/permissionApi';
import { usePermission } from '@/hooks/usePermission';
import ButtonForm from './ButtonForm';
import type { TableProps } from 'antd';

/**
 * 按钮维护组件Props
 */
interface ButtonMaintenanceProps {
  onRefresh?: () => void;
}

/**
 * 按钮维护组件
 * 提供权限按钮的增删改查功能
 */
const ButtonMaintenance: React.FC<ButtonMaintenanceProps> = ({ onRefresh }) => {
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const [formVisible, setFormVisible] = useState(false);
  const [editingButton, setEditingButton] = useState<PermissionButton | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<ButtonSearchParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  // 权限检查
  const canAdd = usePermission(['system:permission:button:add']);
  const canEdit = usePermission(['system:permission:button:edit']);
  const canDelete = usePermission(['system:permission:button:delete']);
  const canBatchDelete = usePermission(['system:permission:button:delete']);

  /**
   * 查询按钮列表
   */
  const {
    data: buttonListResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['permission-buttons', searchParams],
    queryFn: () => permissionService.getButtonList(searchParams),
  });

  /**
   * 删除按钮的mutation
   */
  const deleteButtonMutation = useMutation({
    mutationFn: (buttonId: string) => permissionService.deleteButton(buttonId),
    onSuccess: () => {
      message.success('按钮删除成功');
      queryClient.invalidateQueries({ queryKey: ['permission-buttons'] });
      onRefresh?.();
    },
    onError: (error: any) => {
      message.error(error.message || '删除失败');
    },
  });

  /**
   * 批量删除按钮的mutation
   */
  const batchDeleteMutation = useMutation({
    mutationFn: (buttonIds: string[]) => permissionService.batchDeleteButtons(buttonIds),
    onSuccess: () => {
      message.success('批量删除成功');
      queryClient.invalidateQueries({ queryKey: ['permission-buttons'] });
      setSelectedRowKeys([]);
      onRefresh?.();
    },
    onError: (error: any) => {
      message.error(error.message || '批量删除失败');
    },
  });

  /**
   * 切换按钮状态的mutation
   */
  const toggleStatusMutation = useMutation({
    mutationFn: ({ buttonId, status }: { buttonId: string; status: boolean }) =>
      permissionService.toggleButtonStatus(buttonId, status),
    onSuccess: () => {
      message.success('状态切换成功');
      queryClient.invalidateQueries({ queryKey: ['permission-buttons'] });
      onRefresh?.();
    },
    onError: (error: any) => {
      message.error(error.message || '状态切换失败');
    },
  });

  /**
   * 处理新增按钮
   */
  const handleAdd = useCallback(() => {
    setEditingButton(null);
    setFormVisible(true);
  }, []);

  /**
   * 处理编辑按钮
   * @param button 要编辑的按钮
   */
  const handleEdit = useCallback((button: PermissionButton) => {
    setEditingButton(button);
    setFormVisible(true);
  }, []);

  /**
   * 处理删除按钮
   * @param button 要删除的按钮
   */
  const handleDelete = useCallback(
    (button: PermissionButton) => {
      modal.confirm({
        title: '确认删除',
        content: `确定要删除按钮 "${button.name}" 吗？`,
        onOk: () => {
          deleteButtonMutation.mutate(button.id);
        },
      });
    },
    [deleteButtonMutation, modal],
  );

  /**
   * 处理批量删除
   */
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的按钮');
      return;
    }

    modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个按钮吗？`,
      onOk: () => {
        batchDeleteMutation.mutate(selectedRowKeys as string[]);
      },
    });
  }, [selectedRowKeys, batchDeleteMutation, modal]);

  /**
   * 处理切换状态
   * @param button 按钮
   * @param status 新状态
   */
  const handleToggleStatus = useCallback(
    (button: PermissionButton, status: boolean) => {
      toggleStatusMutation.mutate({ buttonId: button.id, status });
    },
    [toggleStatusMutation],
  );

  /**
   * 处理表单保存
   */
  const handleFormSave = useCallback(() => {
    setFormVisible(false);
    setEditingButton(null);
    refetch();
    onRefresh?.();
  }, [refetch, onRefresh]);

  /**
   * 处理表单取消
   */
  const handleFormCancel = useCallback(() => {
    setFormVisible(false);
    setEditingButton(null);
  }, []);

  /**
   * 处理刷新
   */
  const handleRefresh = useCallback(() => {
    refetch();
    onRefresh?.();
  }, [refetch, onRefresh]);

  /**
   * 处理表格选择变化
   * @param selectedRowKeys 选中的行keys
   */
  const handleSelectionChange = useCallback((selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  /**
   * 处理分页变化
   * @param page 页码
   * @param pageSize 页大小
   */
  const handleTableChange = useCallback((page: number, pageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: page,
      pageSize,
    }));
  }, []);

  /**
   * 表格列定义
   */
  const columns: TableProps<PermissionButton>['columns'] = useMemo(
    () => [
      {
        title: '序号',
        key: 'index',
        width: 80,
        align: 'center',
        render: (_, __, index) => (searchParams.pageNumber! - 1) * searchParams.pageSize! + index + 1,
      },
      {
        title: '按钮名称',
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => <span className="font-medium">{name}</span>,
      },
      {
        title: '权限标识',
        dataIndex: 'code',
        key: 'code',
        render: (code: string) => <Tag color="blue">{code}</Tag>,
      },
      {
        title: '所属菜单',
        dataIndex: 'parentMenuName',
        key: 'parentMenuName',
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: boolean, record: PermissionButton) => (
          <Switch
            checked={status}
            onChange={(checked) => handleToggleStatus(record, checked)}
            disabled={!canEdit}
            size="small"
          />
        ),
      },
      {
        title: '排序',
        dataIndex: 'sortNo',
        key: 'sortNo',
        width: 80,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        align: 'center',
        render: (_, record: PermissionButton) => (
          <Space size="small">
            {canEdit && (
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                编辑
              </Button>
            )}
            {canDelete && (
              <Popconfirm
                title="确认删除"
                description={`确定要删除按钮 "${record.name}" 吗？`}
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  loading={deleteButtonMutation.isPending}
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ],
    [
      searchParams.pageNumber,
      searchParams.pageSize,
      canEdit,
      canDelete,
      handleToggleStatus,
      handleEdit,
      handleDelete,
      deleteButtonMutation.isPending,
    ],
  );

  return (
    <div className="h-full flex flex-col">
      {/* 操作栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <Space>
            {canAdd && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增按钮
              </Button>
            )}
            {canBatchDelete && selectedRowKeys.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
                loading={batchDeleteMutation.isPending}
              >
                批量删除 ({selectedRowKeys.length})
              </Button>
            )}
          </Space>
          <Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading}>
            刷新
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          dataSource={buttonListResponse?.records || []}
          loading={isLoading}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: handleSelectionChange,
            getCheckboxProps: (record) => ({
              disabled: !canDelete,
            }),
          }}
          pagination={{
            current: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            total: buttonListResponse?.totalRow || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </div>

      {/* 按钮表单弹窗 */}
      <Modal
        title={editingButton ? '编辑按钮' : '新增按钮'}
        open={formVisible}
        onCancel={handleFormCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <ButtonForm button={editingButton || undefined} onSave={handleFormSave} onCancel={handleFormCancel} />
      </Modal>
    </div>
  );
};

export default ButtonMaintenance;
