import { Button, Checkbox, Space, Table, type TableProps } from 'antd';
import { useState } from 'react';
import useParentSize from '@/hooks/useParentSize';

/**
 * 端点配置表格
 * @returns
 */
const EndpointConfigTable: React.FC<EndpointConfigTableProps> = ({ action, configData, onConfigDataChange }) => {
  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<any[]>([]);
  // 计算表格高度
  const { parentRef, height } = useParentSize();
  // 根据action判断是否为编辑状态
  // configData填充表格数据

  // 编辑表格字段
  const configColumn: TableProps<Record<string, any>>['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      fixed: 'left',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 160,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 120,
    },
    {
      title: '提示信息',
      dataIndex: 'tips',
      key: 'tips',
      width: 220,
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      align: 'center',
      width: 100,
      render(value: any) {
        return <Checkbox checked={value} />;
      },
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 160,
    },
    {
      title: '允许值',
      dataIndex: 'allowedValue',
      key: 'allowedValue',
      width: 160,
    },
    {
      title: '应用端',
      dataIndex: 'appliesTo',
      key: 'appliesTo',
      align: 'center',
      width: 160,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 120,
    },
    {
      fixed: 'right',
      title: '操作',
      align: 'center',
      width: 120,
      render: (_: any, record: any) => {
        return (
          <Space size={0}>
            <Button size="small" type="link" style={{ color: '#fa8c16' }} onClick={() => {}}>
              编辑
            </Button>
            <Button size="small" variant="link" color="danger">
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const datasource = [
    {
      id: 1,
      name: 'name1',
      title: 'title1',
      type: 'type1',
      tips: 'tips1',
      required: true,
      defaultValue: 'defaultValue1',
      allowedValue: 'allowedValue1',
      appliesTo: 'appliesTo1',
      description: 'description1',
    },
    {
      id: 2,
      name: 'name2',
      title: 'title1',
      type: 'type1',
      tips: 'tips1',
      required: false,
      defaultValue: 'defaultValue1',
      allowedValue: 'allowedValue1',
      appliesTo: 'appliesTo1',
      description: 'description1',
    },
  ];

  /**
   * 单行编辑保存的时候
   */
  const onSave = () => {
    // 更新config数据
    onConfigDataChange('');
  };

  /**
   * 多行选中的配置
   */
  const rowSelection: TableProps['rowSelection'] = {
    // 行选中的回调
    onChange(_selectedRowKeys, selectedRows) {
      setSelectedRows(selectedRows);
    },
    columnWidth: 60,
    fixed: true,
  };

  return (
    <div className="config-table" style={{ flex: 1 }} ref={parentRef}>
      <Table
        title={() => (
          <Button type="link" disabled={selRows.length === 0 || action === 'view'}>
            批量清除
          </Button>
        )}
        bordered
        size="middle"
        dataSource={datasource}
        columns={configColumn}
        rowSelection={{ ...rowSelection }}
        rowKey="id"
        scroll={{ x: 'max-content', y: height - 217 }}
        footer={() => {
          return (
            <Button type="dashed" style={{ width: '100%' }} onClick={() => {}} disabled={action === 'view'}>
              添加一行
            </Button>
          );
        }}
      />
    </div>
  );
};
export default EndpointConfigTable;

/**
 * 需要的属性
 */
type EndpointConfigTableProps = {
  // 当前动作
  action: string;
  // 当前配置数据
  configData: any;
  // 配置数据更新
  onConfigDataChange: (data: any) => void;
};
