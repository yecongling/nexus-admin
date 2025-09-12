import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Tag, Space, Button, Divider, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react';
import type React from 'react';
import {
  permissionButtonService,
  type PermissionButtonModel,
} from '@/services/system/permission/PermissionButton/permissionButtonApi';
import { usePermission } from '@/hooks/usePermission';
import ButtonForm from './ButtonForm';
import ButtonInterfacePermission from './ButtonInterfacePermission';

/**
 * 按钮详情组件Props
 */
interface ButtonDetailProps {
  button: PermissionButtonModel;
  onRefresh: () => void;
}

/**
 * 按钮详情组件
 * 展示权限按钮的详细信息和关联的接口权限
 */
const ButtonDetail: React.FC<ButtonDetailProps> = ({ button, onRefresh }) => {
  const [editing, setEditing] = useState(false);

  // 权限检查
  const canEdit = usePermission(['system:permission:button:edit']);
  const canDelete = usePermission(['system:permission:button:delete']);

  /**
   * 查询按钮关联的接口权限
   */
  const {
    data: interfacePermissions,
    isLoading: interfaceLoading,
    refetch: refetchInterfaces,
  } = useQuery({
    queryKey: ['button-interfaces', button.id],
    queryFn: () => permissionButtonService.getButtonInterfaces(button.id),
    enabled: !!button.id,
  });

  /**
   * 处理编辑
   */
  const handleEdit = useCallback(() => {
    setEditing(true);
  }, []);

  /**
   * 处理取消编辑
   */
  const handleCancelEdit = useCallback(() => {
    setEditing(false);
  }, []);

  /**
   * 处理保存编辑
   */
  const handleSaveEdit = useCallback(() => {
    setEditing(false);
    onRefresh();
  }, [onRefresh]);

  /**
   * 处理删除
   */
  const handleDelete = useCallback(() => {
    // TODO: 实现删除逻辑
    console.log('删除按钮:', button.id);
  }, [button.id]);

  /**
   * 处理刷新接口权限
   */
  const handleRefreshInterfaces = useCallback(() => {
    refetchInterfaces();
  }, [refetchInterfaces]);

  if (editing) {
    return <ButtonForm button={button} onSave={handleSaveEdit} onCancel={handleCancelEdit} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* 按钮基本信息 */}
      <Card
        title="按钮信息"
        size="small"
        className="mb-4"
        extra={
          <Space>
            {canEdit && (
              <Button type="primary" icon={<EditOutlined />} size="small" onClick={handleEdit}>
                编辑
              </Button>
            )}
            {canDelete && (
              <Button danger icon={<DeleteOutlined />} size="small" onClick={handleDelete}>
                删除
              </Button>
            )}
            <Button type="text" icon={<ReloadOutlined />} size="small" onClick={onRefresh}>
              刷新
            </Button>
          </Space>
        }
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="按钮名称" span={2}>
            <span className="font-medium">{button.name}</span>
          </Descriptions.Item>
          <Descriptions.Item label="权限标识">
            <Tag color="blue">{button.code}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={button.status ? 'green' : 'red'}>{button.status ? '启用' : '禁用'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所属菜单">{button.parentMenuName}</Descriptions.Item>
          <Descriptions.Item label="排序">{button.sortNo}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{button.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{button.updateTime}</Descriptions.Item>
          {button.description && (
            <Descriptions.Item label="描述" span={2}>
              {button.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Divider />

      {/* 关联的接口权限 */}
      <div className="flex-1">
        <Card
          title="关联接口权限"
          size="small"
          className="h-full"
          styles={{ body: { height: 'calc(100% - 57px)', padding: 0 } }}
          extra={
            <Button
              type="text"
              icon={<ReloadOutlined />}
              size="small"
              onClick={handleRefreshInterfaces}
              loading={interfaceLoading}
            >
              刷新
            </Button>
          }
        >
          {interfaceLoading ? (
            <div className="flex items-center justify-center h-32">
              <Spin />
            </div>
          ) : (
            <ButtonInterfacePermission
              buttonId={button.id}
              interfacePermissions={interfacePermissions || []}
              onRefresh={handleRefreshInterfaces}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ButtonDetail;
