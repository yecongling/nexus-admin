import { App, Button, Dropdown, type MenuProps, Space, Upload, Tooltip, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify-icon/react';
import { PlusOutlined, ReloadOutlined, SettingOutlined, ColumnHeightOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { usePermission } from '@/hooks/usePermission';
import { MyIcon } from '@/components/MyIcon';

interface TableActionButtonsProps {
  handleAdd: () => void;
  handleBatchDelete: () => void;
  refetch: () => void;
  selectedRows: any[];
}

// 表格操作按钮
const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  handleAdd,
  handleBatchDelete,
  refetch,
  selectedRows,
}) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  // 权限检查
  const canAdd = usePermission(['sys:user:add']);
  const canBatchDelete = usePermission(['sys:user:delete']);
  const canBatchImport = usePermission(['sys:user:import']);
  const canBatchExport = usePermission(['sys:user:export']);
  const canRecover = usePermission(['sys:user:recover']);
  const canBatchResetPassword = usePermission(['sys:user:resetPassword']);
  const canBatchAssignRole = usePermission(['sys:user:assignRole']);
  const canBatchUpdateStatus = usePermission(['sys:user:updateStatus']);
  const canUpdatePassword = usePermission(['sys:user:updatePassword']);
  const canUpdateStatus = usePermission(['sys:user:updateStatus']);
  // 导出选项
  const exportItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: '导出为CSV',
      icon: <Icon icon="teenyicons:csv-outline" className="text-xl! block text-orange-400" />,
      onClick: () => {
        message.info('导出CSV功能待实现');
      },
    },
    {
      key: 'excel',
      label: '导出为Excel',
      icon: <Icon icon="vscode-icons:file-type-excel" className="text-xl! block" />,
      onClick: () => {
        message.info('导出Excel功能待实现');
      },
    },
    {
      key: 'pdf',
      label: '导出为PDF',
      icon: <Icon icon="material-icon-theme:pdf" className="text-xl! block" />,
      onClick: () => {
        message.info('导出PDF功能待实现');
      },
    },
  ];

  // 批量操作选项 - 根据权限动态禁用
  const batchItems: MenuProps['items'] = [
    {
      key: 'assignRole',
      label: '批量分配角色',
      icon: <MyIcon type="nexus-assigned" className="text-xl! block" />,
      disabled: selectedRows.length === 0 || !canBatchAssignRole,
      onClick: () => {
        if (!canBatchAssignRole) {
          message.warning('您没有分配角色的权限');
          return;
        }
        message.warning('批量分配角色功能待实现');
      },
    },
    {
      key: 'updateStatus',
      label: '批量更新状态',
      icon: <Icon icon="fluent:status-24-regular" className="text-xl! block" />,
      onClick: () => {
        if (!canBatchUpdateStatus) {
          message.warning('您没有更新状态的权限');
          return;
        }
        message.warning('批量更新状态功能待实现');
      },
    },
    {
      key: 'resetPassword',
      label: '批量重置密码',
      icon: <Icon icon="hugeicons:reset-password" className="text-xl! block" />,
      disabled: selectedRows.length === 0 || !canBatchResetPassword,
      onClick: () => {
        if (!canBatchResetPassword) {
          message.warning('您没有重置密码的权限');
          return;
        }
        message.warning('批量重置密码功能待实现');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: '批量删除',
      icon: <Icon icon="fluent:delete-dismiss-24-filled" className="text-xl! block text-[#ff4d4f]" />,
      disabled: selectedRows.length === 0 || !canBatchDelete,
      onClick: () => {
        if (!canBatchDelete) {
          message.warning('您没有删除用户的权限');
          return;
        }
        handleBatchDelete();
      },
    },
  ];

  // 表格工具选项
  const tableToolsItems: MenuProps['items'] = [
    {
      key: 'refresh',
      label: '刷新数据',
      icon: <ReloadOutlined />,
      onClick: refetch,
    },
    {
      key: 'columns',
      label: '列设置',
      icon: <Icon icon="fluent:column-edit-24-regular" className="text-lg block" />,
      onClick: () => {
        message.info('列设置功能待实现');
      },
    },
    {
      key: 'tableSize',
      label: '表格大小',
      icon: <ColumnHeightOutlined />,
      onClick: () => {
        message.info('表格大小设置功能待实现');
      },
    },
    {
      key: 'density',
      label: '表格密度',
      icon: <UnorderedListOutlined />,
      onClick: () => {
        message.info('表格密度设置功能待实现');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: '表格设置',
      icon: <SettingOutlined />,
      onClick: () => {
        message.info('表格设置功能待实现');
      },
    },
  ];

  /**
   * 批量重置密码
   * @param newPwd 新密码
   */
  const handleBatchResetPassword = (newPwd: string) => {
    message.info('批量重置密码功能待实现');
  };

  return (
    <div className="flex items-center justify-between mb-4">
      {/* 左侧主要操作按钮 */}
      <Space size="middle">
        {canAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="shadow-sm">
            {t('common.operation.add')}
          </Button>
        )}

        {canBatchImport && (
          <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            action="/api/user/import"
            onChange={(info) => {
              if (info.file.status === 'done') {
                message.success('导入成功');
                refetch();
              } else if (info.file.status === 'error') {
                message.error('导入失败');
              }
            }}
          >
            <Button
              icon={<Icon icon="material-icon-theme:folder-import" className="text-xl! block" />}
              className="shadow-sm"
            >
              {t('common.operation.import')}
            </Button>
          </Upload>
        )}

        {canBatchExport && (
          <Dropdown.Button
            menu={{ items: exportItems }}
            icon={<Icon icon="material-icon-theme:folder-export" className="text-xl! block" />}
            className="shadow-sm"
          >
            {t('common.operation.export')}
          </Dropdown.Button>
        )}

        {/* 批量操作下拉菜单 */}
        <Dropdown menu={{ items: batchItems }} placement="bottomLeft">
          <Button
            icon={<Icon icon="fluent:options-24-regular" className="text-xl! block" />}
            disabled={selectedRows.length === 0}
            className="shadow-sm"
          >
            批量操作
            {selectedRows.length > 0 && <Badge count={selectedRows.length} size="small" className="ml-1" />}
          </Button>
        </Dropdown>

        {/* 回收站按钮 - 移到左边 */}
        {canRecover && (
          <Button
            icon={<Icon icon="fa:recycle" className="text-xl! block text-green-500" />}
            onClick={() => {
              message.warning('回收站功能待实现');
            }}
            className="shadow-sm"
          >
            {t('common.operation.recycle')}
          </Button>
        )}
      </Space>

      {/* 右侧表格工具按钮 */}
      <Space size="small">
        <Tooltip title="刷新数据">
          <Button
            icon={<ReloadOutlined />}
            type="text"
            onClick={refetch}
            className="text-gray-500 hover:text-blue-500"
          />
        </Tooltip>
        
        <Tooltip title="列设置">
          <Button
            icon={<Icon icon="fluent:column-edit-24-regular" className="text-lg block" />}
            type="text"
            onClick={() => message.info('列设置功能待实现')}
            className="text-gray-500 hover:text-blue-500"
          />
        </Tooltip>
        
        <Tooltip title="表格大小">
          <Button
            icon={<ColumnHeightOutlined />}
            type="text"
            onClick={() => message.info('表格大小设置功能待实现')}
            className="text-gray-500 hover:text-blue-500"
          />
        </Tooltip>
        
        <Tooltip title="表格密度">
          <Button
            icon={<UnorderedListOutlined />}
            type="text"
            onClick={() => message.info('表格密度设置功能待实现')}
            className="text-gray-500 hover:text-blue-500"
          />
        </Tooltip>
        
        <Tooltip title="表格设置">
          <Button
            icon={<SettingOutlined />}
            type="text"
            onClick={() => message.info('表格设置功能待实现')}
            className="text-gray-500 hover:text-blue-500"
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default TableActionButtons;
