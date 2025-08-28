import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReloadOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Card, Table, Button, Space, Tag, Modal, Tooltip, type TableProps, Input, Form } from 'antd';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type React from 'react';
import type { MenuModel } from '@/services/system/menu/type';
import { menuService, type InterfacePermission } from '@/services/system/menu/menuApi';

// 组件状态类型 - 合并所有状态
interface ComponentState {
  permissionList: InterfacePermission[];
  editingId: string | null;
  editForm: {
    id: string;
    code: string;
    remark: string;
  };
  nextId: number;
  errors: {
    code?: string;
    remark?: string;
  };
  // 分页相关状态
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

/**
 * 菜单接口权限
 * @returns 菜单接口权限
 */
const MenuInterfacePermission: React.FC<MenuInterfacePermissionProps> = ({ menu }) => {
  const queryClient = useQueryClient();

  // 合并所有状态到一个对象中
  const [state, setState] = useState<ComponentState>({
    permissionList: [],
    editingId: null,
    editForm: { id: '', code: '', remark: '' },
    nextId: 1,
    errors: {},
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
    },
  });

  // 输入框引用
  const codeInputRef = useRef<any>(null);
  const remarkInputRef = useRef<any>(null);

  // 查询菜单接口权限数据
  const {
    isLoading,
    data: initialData,
    refetch,
  } = useQuery({
    queryKey: ['menu-interface-permission', menu?.id, state.pagination.current, state.pagination.pageSize],
    queryFn: async () => {
      if (!menu?.id) return { records: [], totalRow: 0, pageNumber: 1, pageSize: 10, totalPage: 0 };
      const response = await menuService.queryInterfacePermissions({
        menuId: menu.id,
        pageNumber: state.pagination.current,
        pageSize: state.pagination.pageSize,
      });
      return response;
    },
    enabled: !!menu?.id,
  });

  // 保存接口权限的mutation
  const savePermissionMutation = useMutation({
    mutationFn: async (data: { type: 'create' | 'update' | 'delete'; permission: InterfacePermission }) => {
      switch (data.type) {
        case 'create':
          return await menuService.createInterfacePermission({
            menuId: menu?.id || '',
            code: data.permission.code,
            remark: data.permission.remark,
          });
        case 'update':
          return await menuService.updateInterfacePermission({
            id: data.permission.id,
            code: data.permission.code,
            remark: data.permission.remark,
          });
        case 'delete':
          return await menuService.deleteInterfacePermission(data.permission.id);
        default:
          throw new Error('未知的操作类型');
      }
    },
    onSuccess: () => {
      // 重新获取数据
      queryClient.invalidateQueries({
        queryKey: ['menu-interface-permission', menu?.id, state.pagination.current, state.pagination.pageSize],
      });
    },
  });

  // 初始化数据
  useEffect(() => {
    if (initialData?.records) {
      setState((prev) => ({
        ...prev,
        permissionList: initialData.records,
        nextId: initialData.records.length + 1,
        pagination: {
          current: initialData.pageNumber,
          pageSize: initialData.pageSize,
          total: initialData.totalRow,
          totalPage: initialData.totalPage,
        },
      }));
    }
  }, [initialData]);

  // 监听错误状态变化，自动聚焦到第一个错误输入框
  useEffect(() => {
    if (Object.keys(state.errors).length > 0) {
      requestAnimationFrame(() => {
        if (state.errors.code) {
          codeInputRef.current?.focus();
        } else if (state.errors.remark) {
          remarkInputRef.current?.focus();
        }
      });
    }
  }, [state.errors]);

  // 更新状态的辅助函数
  const updateState = useCallback((updates: Partial<ComponentState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // 清除错误状态
  const clearErrors = useCallback(() => {
    updateState({ errors: {} });
  }, [updateState]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // 处理分页变化
  const handleTableChange = useCallback(
    (pagination: any, _filters: any) => {
      updateState({
        pagination: {
          ...state.pagination,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
      });
    },
    [state.pagination, updateState],
  );

  // 添加接口权限
  const handleAdd = useCallback(() => {
    // 检查是否有未保存的编辑数据
    if (state.editingId) {
      Modal.warning({
        title: '请先完成当前编辑',
        content: '您有未保存的编辑数据，请先完成保存或取消编辑后再添加新行。',
        okText: '知道了',
        centered: true,
      });
      return;
    }

    const newRow: InterfacePermission = {
      id: `temp_${state.nextId}`,
      code: '',
      remark: '',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    updateState({
      permissionList: [...state.permissionList, newRow],
      editingId: newRow.id,
      editForm: { id: newRow.id, code: '', remark: '' },
      nextId: state.nextId + 1,
      errors: {},
    });
  }, [state.editingId, state.permissionList, state.nextId, updateState]);

  // 开始编辑
  const handleEdit = useCallback(
    (record: InterfacePermission) => {
      updateState({
        editingId: record.id,
        editForm: { id: record.id, code: record.code, remark: record.remark },
        errors: {},
      });
    },
    [updateState],
  );

  // 取消编辑
  const handleCancelEdit = useCallback(
    (id: string) => {
      if (id.startsWith('temp_')) {
        // 如果是临时行，直接删除
        updateState({
          permissionList: state.permissionList.filter((item) => item.id !== id),
          editingId: null,
          editForm: { id: '', code: '', remark: '' },
          errors: {},
        });
      } else {
        updateState({
          editingId: null,
          editForm: { id: '', code: '', remark: '' },
          errors: {},
        });
      }
    },
    [state.permissionList, updateState],
  );

  // 确认编辑
  const handleConfirmEdit = useCallback(
    async (id: string) => {
      // 清除之前的错误
      clearErrors();

      const newErrors: { code?: string; remark?: string } = {};

      // 验证编码
      if (!state.editForm.code.trim()) {
        newErrors.code = '编码不能为空';
      }

      // 验证备注
      if (!state.editForm.remark.trim()) {
        newErrors.remark = '备注不能为空';
      }

      // 如果有错误，显示错误并聚焦到第一个错误输入框
      if (Object.keys(newErrors).length > 0) {
        updateState({ errors: newErrors });
        return;
      }

      // 准备保存的数据
      const updatedItem = {
        ...state.permissionList.find((item) => item.id === id)!,
        code: state.editForm.code,
        remark: state.editForm.remark,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      // 如果是临时行，生成正式ID
      if (id.startsWith('temp_')) {
        updatedItem.id = state.nextId.toString();
        updateState({ nextId: state.nextId + 1 });
      }

      // 调用保存接口
      try {
        await savePermissionMutation.mutateAsync({
          type: id.startsWith('temp_') ? 'create' : 'update',
          permission: updatedItem,
        });

        // 更新本地状态
        updateState({
          permissionList: state.permissionList.map((item) => (item.id === id ? updatedItem : item)),
          editingId: null,
          editForm: { id: '', code: '', remark: '' },
        });
      } catch (error) {
        // 错误处理已在mutation中处理
      }
    },
    [state.editForm, state.permissionList, state.nextId, updateState, clearErrors, savePermissionMutation],
  );

  // 删除接口权限
  const handleDelete = useCallback(
    async (record: InterfacePermission) => {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除接口权限 "${record.code}" 吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await savePermissionMutation.mutateAsync({
              type: 'delete',
              permission: record,
            });

            // 更新本地状态
            updateState({
              permissionList: state.permissionList.filter((item) => item.id !== record.id),
            });
          } catch (error) {
            // 错误处理已在mutation中处理
          }
        },
      });
    },
    [state.permissionList, updateState, savePermissionMutation],
  );

  // 使用useMemo优化表格列定义，避免每次渲染都重新创建
  const columns: TableProps<InterfacePermission>['columns'] = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        align: 'center',
        render: (_text: string, _record: InterfacePermission, index: number) => index + 1,
      },
      {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
        render: (text: string, record: InterfacePermission) => {
          if (state.editingId === record.id) {
            return (
              <Form.Item
                validateStatus={state.errors.code ? 'error' : ''}
                help={state.errors.code}
                style={{ marginBottom: 0 }}
              >
                <Input
                  ref={codeInputRef}
                  value={state.editForm.code}
                  onChange={(e) =>
                    updateState({
                      editForm: { ...state.editForm, code: e.target.value },
                    })
                  }
                  placeholder="请输入编码"
                  status={state.errors.code ? 'error' : ''}
                />
              </Form.Item>
            );
          }
          return <Tag color="blue">{text}</Tag>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        ellipsis: true,
        render: (text: string, record: InterfacePermission) => {
          if (state.editingId === record.id) {
            return (
              <Form.Item
                validateStatus={state.errors.remark ? 'error' : ''}
                help={state.errors.remark}
                style={{ marginBottom: 0 }}
              >
                <Input
                  ref={remarkInputRef}
                  value={state.editForm.remark}
                  onChange={(e) =>
                    updateState({
                      editForm: { ...state.editForm, remark: e.target.value },
                    })
                  }
                  placeholder="请输入备注"
                  status={state.errors.remark ? 'error' : ''}
                />
              </Form.Item>
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        align: 'center',
        render: (_text: string, record: InterfacePermission) => {
          if (state.editingId === record.id) {
            return (
              <Space size="small">
                <Tooltip title="确定">
                  <Button
                    type="link"
                    icon={<CheckOutlined />}
                    size="small"
                    onClick={() => handleConfirmEdit(record.id)}
                    style={{ color: '#52c41a' }}
                    loading={savePermissionMutation.isPending}
                  />
                </Tooltip>
                <Tooltip title="取消">
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => handleCancelEdit(record.id)}
                    style={{ color: '#ff4d4f' }}
                  />
                </Tooltip>
              </Space>
            );
          }

          return (
            <Space size="small">
              <Tooltip title="编辑">
                <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDelete(record)}
                  loading={savePermissionMutation.isPending}
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [
      state.editingId,
      state.editForm,
      state.errors,
      handleAdd,
      handleEdit,
      handleConfirmEdit,
      handleCancelEdit,
      handleDelete,
      updateState,
      savePermissionMutation.isPending,
    ],
  );

  return (
    <Card
      className="flex-1 max-h-full flex flex-col"
      title="接口权限列表"
      styles={{ body: { flex: 1 } }}
      extra={
        <Button
          color="default"
          variant="outlined"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          刷新
        </Button>
      }
    >
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={state.permissionList}
        rowKey="id"
        pagination={{
          current: state.pagination.current,
          pageSize: state.pagination.pageSize,
          total: state.pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
        size="middle"
        bordered
        footer={() => {
          // 检查是否有菜单数据
          const hasMenuData = !!menu?.id;
          // 检查是否有未保存的编辑数据
          const hasUnsavedData = !!state.editingId;

          // 根据状态决定按钮的样式和文本
          let buttonText = '添加一行';
          let buttonType: 'dashed' | 'default' = 'dashed';
          let buttonDisabled = false;
          let tooltipText = '点击添加新行';

          if (!hasMenuData) {
            buttonText = '请先选择菜单';
            buttonType = 'default';
            buttonDisabled = true;
            tooltipText = '请先选择菜单后再添加接口权限';
          } else if (hasUnsavedData) {
            buttonText = '请先完成当前编辑';
            buttonType = 'default';
            buttonDisabled = true;
            tooltipText = '您有未保存的编辑数据，请先完成保存或取消编辑';
          }

          return (
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500">
                {hasUnsavedData && (
                  <span className="text-orange-500">⚠️ 有未保存的编辑数据，请先完成保存后继续添加</span>
                )}
                {!hasMenuData && <span className="text-gray-400">📋 请先选择菜单</span>}
              </div>
              <Button
                type={buttonType}
                style={{ width: '100%' }}
                onClick={handleAdd}
                disabled={buttonDisabled}
                title={tooltipText}
              >
                {buttonText}
              </Button>
            </div>
          );
        }}
      />
    </Card>
  );
};

export default MenuInterfacePermission;

export type MenuInterfacePermissionProps = {
  menu?: MenuModel;
};
