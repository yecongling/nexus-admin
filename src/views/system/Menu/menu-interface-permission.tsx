import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Card, Table, Button, Space, Tag, Modal, Tooltip, type TableProps, Input, Form } from 'antd';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type React from 'react';
import type { MenuModel } from '@/services/system/menu/type';
import {
  menuService,
  type InterfacePermission,
} from '@/services/system/menu/menuApi';



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
    queryKey: ['menu-interface-permission', menu?.id],
    queryFn: async () => {
      if (!menu?.id) return { list: [], total: 0, pageNum: 1, pageSize: 10 };
      const response = await menuService.queryInterfacePermissions({
        menuId: menu.id,
        pageNum: 1,
        pageSize: 10,
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
      queryClient.invalidateQueries({ queryKey: ['menu-interface-permission', menu?.id] });
    }
  });

  // 初始化数据
  useEffect(() => {
    if (initialData?.list) {
      setState(prev => ({
        ...prev,
        permissionList: initialData.list,
        nextId: initialData.list.length + 1,
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
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 清除错误状态
  const clearErrors = useCallback(() => {
    updateState({ errors: {} });
  }, [updateState]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // 添加接口权限
  const handleAdd = useCallback(() => {
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
  }, [state.permissionList, state.nextId, updateState]);

  // 开始编辑
  const handleEdit = useCallback((record: InterfacePermission) => {
    updateState({
      editingId: record.id,
      editForm: { id: record.id, code: record.code, remark: record.remark },
      errors: {},
    });
  }, [updateState]);

  // 取消编辑
  const handleCancelEdit = useCallback((id: string) => {
    if (id.startsWith('temp_')) {
      // 如果是临时行，直接删除
      updateState({
        permissionList: state.permissionList.filter(item => item.id !== id),
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
  }, [state.permissionList, updateState]);

  // 确认编辑
  const handleConfirmEdit = useCallback(async (id: string) => {
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
      ...state.permissionList.find(item => item.id === id)!,
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
        permissionList: state.permissionList.map(item => 
          item.id === id ? updatedItem : item
        ),
        editingId: null,
        editForm: { id: '', code: '', remark: '' },
      });
    } catch (error) {
      // 错误处理已在mutation中处理
    }
  }, [state.editForm, state.permissionList, state.nextId, updateState, clearErrors, savePermissionMutation]);

  // 删除接口权限
  const handleDelete = useCallback(async (record: InterfacePermission) => {
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
            permissionList: state.permissionList.filter(item => item.id !== record.id),
          });
        } catch (error) {
          // 错误处理已在mutation中处理
        }
      },
    });
  }, [state.permissionList, updateState, savePermissionMutation]);

  // 使用useMemo优化表格列定义，避免每次渲染都重新创建
  const columns: TableProps<InterfacePermission>['columns'] = useMemo(() => [
    {
      title: (
        <Space>
          <Tooltip title="添加接口">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" onClick={handleAdd} />
          </Tooltip>
        </Space>
      ),
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
                onChange={(e) => updateState({ 
                  editForm: { ...state.editForm, code: e.target.value } 
                })}
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
                onChange={(e) => updateState({ 
                  editForm: { ...state.editForm, remark: e.target.value } 
                })}
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
  ], [state.editingId, state.editForm, state.errors, handleAdd, handleEdit, handleConfirmEdit, handleCancelEdit, handleDelete, updateState, savePermissionMutation.isPending]);

  return (
    <Card
      className="flex-1 max-h-full"
      title="接口权限列表"
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
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 'max-content' }}
        size="middle"
        bordered
      />
    </Card>
  );
};

export default MenuInterfacePermission;

export type MenuInterfacePermissionProps = {
  menu?: MenuModel;
};
