import type React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';

interface TableActionButtonsProps {
  onAdd: () => void;
  onBatchDelete: () => void;
  onRefresh: () => void;
  onColumnSettings: () => void;
  selectedRowKeys: React.Key[];
  loading?: boolean;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  onAdd,
  onBatchDelete,
  onRefresh,
  onColumnSettings,
  selectedRowKeys,
  loading = false,
}) => {
  const hasSelection = selectedRowKeys.length > 0;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-lg font-medium text-gray-800">参数列表</div>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
        >
          新增
        </Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={onBatchDelete}
          disabled={!hasSelection}
          danger
          className="border-red-500 text-red-500 hover:border-red-600 hover:text-red-600"
        >
          批量删除
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
        >
          刷新
        </Button>
        <Tooltip title="列设置">
          <Button
            icon={<SettingOutlined />}
            onClick={onColumnSettings}
            className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
          >
            列设置
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
};

export default TableActionButtons;
