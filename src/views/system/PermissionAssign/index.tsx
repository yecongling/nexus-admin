import { Card, Tabs } from 'antd';
import { useState } from 'react';
import type React from 'react';
import RolePermissionAssign from './RolePermissionAssign';
import PermissionPreview from './PermissionPreview';
import BatchPermissionOperation from './BatchPermissionOperation';

/**
 * 权限分配管理主组件
 * 提供角色权限分配、权限预览和批量操作功能
 */
const PermissionAssign: React.FC = () => {
  const [activeTab, setActiveTab] = useState('role-assign');

  /**
   * 处理Tab切换
   * @param key 选中的Tab key
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="permission-assign-container h-full">
      <Card className="h-full" bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: 'role-assign',
              label: '角色权限分配',
              children: <RolePermissionAssign />,
            },
            {
              key: 'permission-preview',
              label: '权限预览',
              children: <PermissionPreview />,
            },
            {
              key: 'batch-operation',
              label: '批量操作',
              children: <BatchPermissionOperation />,
            },
          ]}
          className="h-full"
          tabBarStyle={{ marginBottom: 0, padding: '0 24px' }}
        />
      </Card>
    </div>
  );
};

export default PermissionAssign;
