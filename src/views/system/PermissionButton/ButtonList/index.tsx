import { useState, useCallback, useMemo } from 'react';
import { Empty, Spin, Tabs } from 'antd';
import type React from 'react';
import ButtonTree from './ButtonTree';
import ButtonDetail from './ButtonDetail';
import ButtonMaintenance from './ButtonMaintenance';
import type { PermissionButton } from '@/services/system/permission/permissionApi';

/**
 * 按钮列表主组件
 * 提供权限按钮的树形展示和详情查看功能
 */
const ButtonList: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<PermissionButton | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tree');

  /**
   * 处理按钮选择
   * @param button 选中的按钮
   */
  const handleSelectButton = useCallback((button: PermissionButton | null) => {
    setSelectedButton(button);
  }, []);

  /**
   * 处理按钮刷新
   */
  const handleRefresh = useCallback(() => {
    setLoading(true);
    // 这里可以触发树组件的刷新
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  /**
   * 处理Tab切换
   * @param key 选中的Tab key
   */
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  /**
   * 渲染树形视图
   */
  const renderTreeView = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Spin size="large" />
        </div>
      );
    }

    if (!selectedButton) {
      return (
        <Empty
          description="请选择权限按钮"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="flex flex-col items-center justify-center h-full"
        />
      );
    }

    return <ButtonDetail button={selectedButton} onRefresh={handleRefresh} />;
  }, [selectedButton, loading, handleRefresh]);

  return (
    <div className="h-full">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: 'tree',
            label: '树形视图',
            children: (
              <div className="flex h-full">
                {/* 左侧按钮树 */}
                <div className="w-1/3 pr-4 border-r border-gray-200">
                  <ButtonTree
                    onSelectButton={handleSelectButton}
                    selectedButtonId={selectedButton?.id}
                    loading={loading}
                  />
                </div>

                {/* 右侧按钮详情 */}
                <div className="flex-1 pl-4">
                  {renderTreeView}
                </div>
              </div>
            ),
          },
          {
            key: 'maintenance',
            label: '维护管理',
            children: <ButtonMaintenance onRefresh={handleRefresh} />,
          },
        ]}
        className="h-full"
        tabBarStyle={{ marginBottom: 0 }}
      />
    </div>
  );
};

export default ButtonList;
