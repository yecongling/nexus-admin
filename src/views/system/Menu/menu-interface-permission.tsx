import { useQuery } from '@tanstack/react-query';
import { Card, Table, Button, Space, Tag, Modal, Tooltip, App, type TableProps, Input, Form } from 'antd';
import { ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import type { MenuModel } from '@/services/system/menu/type';

// 接口权限数据类型
interface InterfacePermission {
  id: string;
  code: string;
  remark: string;
  createTime: string;
  updateTime: string;
}

// 编辑状态类型
interface EditState {
  id: string;
  code: string;
  remark: string;
}

// 错误状态类型
interface ErrorState {
  code?: string;
  remark?: string;
}

// 模拟数据
const mockData: InterfacePermission[] = [
  {
    id: '1',
    code: 'sys:sse:connect',
    remark: 'SSE连接',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
  {
    id: '2',
    code: 'sys:dict:listSelectOptions',
    remark: '通过字典编码查询表单下拉选择项列表',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
];

/**
 * 菜单接口权限
 * @returns 菜单接口权限
 */
const MenuInterfacePermission: React.FC<MenuInterfacePermissionProps> = ({ menu }) => {
  const { message } = App.useApp();
  // 接口权限列表
  const [permissionList, setPermissionList] = useState<InterfacePermission[]>(mockData);
  // 编辑状态 
  const [editingId, setEditingId] = useState<string | null>(null);
  // 编辑表单
  const [editForm, setEditForm] = useState<EditState>({ id: '', code: '', remark: '' });
  // 下一个ID
  const [nextId, setNextId] = useState(3); // 用于生成新的ID
  // 错误状态
  const [errors, setErrors] = useState<ErrorState>({});
  // 输入框引用
  const codeInputRef = useRef<any>(null);
  const remarkInputRef = useRef<any>(null);

  // 查询菜单接口权限数据
  const {
    isLoading,
    data: initialData = mockData,
    refetch,
  } = useQuery({
    queryKey: ['menu-interface-permission', menu?.id],
    queryFn: () => {
      // 这里应该调用实际的API
      return mockData;
    },
    enabled: menu !== undefined,
  });

  // 初始化数据
  useEffect(() => {
    if (initialData) {
      setPermissionList(initialData);
      setNextId(initialData.length + 1);
    }
  }, [initialData]);

  // 监听错误状态变化，自动聚焦到第一个错误输入框
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // 使用 requestAnimationFrame 确保DOM更新完成后再聚焦
      requestAnimationFrame(() => {
        if (errors.code) {
          codeInputRef.current?.focus();
        } else if (errors.remark) {
          remarkInputRef.current?.focus();
        }
      });
    }
  }, [errors]);

  // 清除错误状态
  const clearErrors = () => {
    setErrors({});
  };

  // 刷新数据
  const handleRefresh = () => {
    refetch();
  };

  // 添加接口权限
  const handleAdd = () => {
    const newRow: InterfacePermission = {
      id: `temp_${nextId}`,
      code: '',
      remark: '',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    
    setPermissionList(prev => [...prev, newRow]);
    setEditingId(newRow.id);
    setEditForm({ id: newRow.id, code: '', remark: '' });
    setNextId(prev => prev + 1);
    clearErrors();
  };

  // 开始编辑
  const handleEdit = (record: InterfacePermission) => {
    setEditingId(record.id);
    setEditForm({ id: record.id, code: record.code, remark: record.remark });
    clearErrors();
  };

  // 取消编辑
  const handleCancelEdit = (id: string) => {
    if (id.startsWith('temp_')) {
      // 如果是临时行，直接删除
      setPermissionList(prev => prev.filter(item => item.id !== id));
    }
    setEditingId(null);
    setEditForm({ id: '', code: '', remark: '' });
    clearErrors();
  };

  // 确认编辑
  const handleConfirmEdit = (id: string) => {
    // 清除之前的错误
    clearErrors();
    
    const newErrors: ErrorState = {};
    
    // 验证编码
    if (!editForm.code.trim()) {
      newErrors.code = '编码不能为空';
    }
    
    // 验证备注
    if (!editForm.remark.trim()) {
      newErrors.remark = '备注不能为空';
    }
    
    // 如果有错误，显示错误并聚焦到第一个错误输入框
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPermissionList(prev => 
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            code: editForm.code,
            remark: editForm.remark,
            updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };
          
          // 如果是临时行，生成正式ID
          if (id.startsWith('temp_')) {
            updatedItem.id = nextId.toString();
            setNextId(prev => prev + 1);
          }
          
          return updatedItem;
        }
        return item;
      })
    );

    setEditingId(null);
    setEditForm({ id: '', code: '', remark: '' });
    message.success('保存成功');
  };

  // 删除接口权限
  const handleDelete = (record: InterfacePermission) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除接口权限 "${record.code}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setPermissionList(prev => prev.filter(item => item.id !== record.id));
        message.success('删除成功');
      },
    });
  };

  // 表格列定义
  const columns: TableProps<InterfacePermission>['columns'] = [
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
        if (editingId === record.id) {
          return (
            <Form.Item
              validateStatus={errors.code ? 'error' : ''}
              help={errors.code}
              style={{ marginBottom: 0 }}
            >
              <Input
                ref={codeInputRef}
                value={editForm.code}
                onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="请输入编码"
                status={errors.code ? 'error' : ''}
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
        if (editingId === record.id) {
          return (
            <Form.Item
              validateStatus={errors.remark ? 'error' : ''}
              help={errors.remark}
              style={{ marginBottom: 0 }}
            >
              <Input
                ref={remarkInputRef}
                value={editForm.remark}
                onChange={(e) => setEditForm(prev => ({ ...prev, remark: e.target.value }))}
                placeholder="请输入备注"
                status={errors.remark ? 'error' : ''}
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
        if (editingId === record.id) {
          return (
            <Space size="small">
              <Tooltip title="确定">
                <Button 
                  type="link" 
                  icon={<CheckOutlined />} 
                  size="small" 
                  onClick={() => handleConfirmEdit(record.id)}
                  style={{ color: '#52c41a' }}
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
              <Button type="link" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

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
        dataSource={permissionList}
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
