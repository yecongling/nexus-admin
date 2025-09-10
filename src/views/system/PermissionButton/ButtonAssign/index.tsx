import { useState, useCallback } from 'react';
import { Card, Row, Col, Select, Button, Space, message } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import type React from 'react';
import RolePermissionAssign from './RolePermissionAssign';
import PermissionPreview from './PermissionPreview';

/**
 * 权限分配主组件
 * 提供角色权限分配和权限预览功能
 */
const ButtonAssign: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assign' | 'preview'>('assign');

  /**
   * 处理角色选择
   * @param roleId 选中的角色ID
   */
  const handleRoleSelect = useCallback((roleId: string) => {
    setSelectedRoleId(roleId);
  }, []);

  /**
   * 处理Tab切换
   * @param tab 选中的Tab
   */
  const handleTabChange = useCallback((tab: 'assign' | 'preview') => {
    setActiveTab(tab);
  }, []);

  /**
   * 处理分配完成
   */
  const handleAssignComplete = useCallback(() => {
    message.success('权限分配完成');
    // 可以在这里刷新相关数据
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* 角色选择栏 */}
      <Card size="small" className="mb-4">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space>
              <UserOutlined className="text-gray-500" />
              <span className="font-medium">选择角色：</span>
              <Select
                placeholder="请选择要分配权限的角色"
                style={{ width: 300 }}
                value={selectedRoleId}
                onChange={handleRoleSelect}
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={[
                  { label: '管理员', value: 'admin' },
                  { label: '普通用户', value: 'user' },
                  { label: '访客', value: 'guest' },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type={activeTab === 'assign' ? 'primary' : 'default'}
                icon={<SettingOutlined />}
                onClick={() => handleTabChange('assign')}
              >
                权限分配
              </Button>
              <Button
                type={activeTab === 'preview' ? 'primary' : 'default'}
                icon={<UserOutlined />}
                onClick={() => handleTabChange('preview')}
              >
                权限预览
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <div className="flex-1">
        {!selectedRoleId ? (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <UserOutlined className="text-4xl mb-4" />
              <p>请先选择角色</p>
            </div>
          </Card>
        ) : activeTab === 'assign' ? (
          <RolePermissionAssign roleId={selectedRoleId} onComplete={handleAssignComplete} />
        ) : (
          <PermissionPreview roleId={selectedRoleId} />
        )}
      </div>
    </div>
  );
};

export default ButtonAssign;
