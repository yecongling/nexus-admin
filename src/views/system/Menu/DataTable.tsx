import { Table } from 'antd';
import type { TableProps } from 'antd';

type DataTableProps = {
  dataSource: any[];
  columns: TableProps['columns'];
  isLoading: boolean;
  rowSelection: TableProps['rowSelection'];
  scroll: TableProps['scroll'];
  rowKey: string;
};

/**
 * 数据表格
 */
const DataTable: React.FC<DataTableProps> = ({
  dataSource,
  columns,
  isLoading,
  rowSelection,
  scroll,
  rowKey,
}) => {
  return (
    <Table
      size="small"
      style={{ marginTop: '8px' }}
      bordered
      pagination={false}
      dataSource={dataSource}
      columns={columns}
      loading={isLoading}
      rowKey={rowKey}
      scroll={scroll}
      rowSelection={rowSelection}
    />
  );
};

export default DataTable;
