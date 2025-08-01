import { App, Button, Space, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify-icon/react';

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
  // 是否有新增权限
  const canAdd = usePermission(['sys:user:add']);
  // 是否有批量删除权限
  const canBatchDelete = usePermission(['sys:user:delete']);
  // 是否有批量导入权限
  const canBatchImport = usePermission(['sys:user:import']);
  // 是否有批量导出权限
  const canBatchExport = usePermission(['sys:user:export']);
  // 是否有从回收站恢复权限
  const canRecover = usePermission(['sys:user:recover']);
  return (
    <Space>
      {canAdd && (
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('common.operation.add')}
        </Button>
      )}

      {canBatchImport && (
        <Upload
          accept=".xlsx"
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
          <Button icon={<Icon icon="material-icon-theme:folder-import" className="text-xl! block" />}>
            {t('common.operation.import')}
          </Button>
        </Upload>
      )}

      {canBatchExport && (
        <Button
          icon={<Icon icon="material-icon-theme:folder-export" className="text-xl! block" />}
          disabled={selectedRows.length === 0}
        >
          {t('common.operation.export')}
        </Button>
      )}

      {canBatchDelete && (
        <Button
          danger
          icon={<Icon icon="fluent:delete-dismiss-24-filled" className="text-xl block text-[#ff4d4f]" />}
          disabled={selectedRows.length === 0}
          onClick={handleBatchDelete}
        >
          {t('common.operation.delete')}
        </Button>
      )}
      {canRecover && (
        <Button
          icon={<Icon icon="fa:recycle" className="text-xl! block text-green-500" />}
          onClick={() => {
            // 处理恢复操作
            message.info('恢复功能待实现');
          }}
        >
          {t('common.operation.recycle')}
        </Button>
      )}
    </Space>
  );
};

export default TableActionButtons;
