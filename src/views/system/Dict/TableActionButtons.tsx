import { usePermission } from '@/hooks/usePermission';
import { PlusOutlined, DeleteOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { Space, Button, Upload, message } from 'antd';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  // 是否有新增权限
  const canAdd = usePermission(['sys:dict:add']);
  // 是否有批量删除权限
  const canBatchDelete = usePermission(['sys:dict:delete']);
  // 是否有批量导入权限
  const canBatchImport = usePermission(['sys:dict:import']);
  // 是否有批量导出权限
  const canBatchExport = usePermission(['sys:dict:export']);

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
          action="/api/dict/import"
          onChange={(info) => {
            if (info.file.status === 'done') {
              message.success('导入成功');
              refetch();
            } else if (info.file.status === 'error') {
              message.error('导入失败');
            }
          }}
        >
          <Button icon={<ImportOutlined />}>{t('common.operation.import')}</Button>
        </Upload>
      )}
      {canBatchExport && (
        <Button
          icon={<ExportOutlined />}
          onClick={() => {
            window.open('/api/dict/export');
          }}
        >
          {t('common.operation.export')}
        </Button>
      )}
      {canBatchDelete && (
        <Button danger icon={<DeleteOutlined />} disabled={selectedRows.length === 0} onClick={handleBatchDelete}>
          {t('common.operation.delete')}
        </Button>
      )}
    </Space>
  );
};

export default TableActionButtons;
