import { Card, Tabs } from 'antd';
import { useState } from 'react';
import type React from 'react';
import ButtonList from './ButtonList';
import ButtonAssign from './ButtonAssign';

/**
 * 权限按钮管理主组件
 * 提供权限按钮的维护和分配功能
 */
const PermissionButton: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');

  /**
   * 处理Tab切换
   * @param key 选中的Tab key
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="permission-button-container h-full">
      <Card className="h-full" bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: 'list',
              label: '按钮列表',
              children: <ButtonList />,
            },
            {
              key: 'assign',
              label: '权限分配',
              children: <ButtonAssign />,
            },
          ]}
          className="h-full"
          tabBarStyle={{ marginBottom: 0, padding: '0 24px' }}
        />
      </Card>
    </div>
  );
};

export default PermissionButton;