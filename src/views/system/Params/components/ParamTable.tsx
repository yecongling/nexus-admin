import React from 'react';
import { Table, Button, Space, Tooltip, Tag, Switch } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { SysParam } from '../types';
import { DATA_TYPE_OPTIONS, STATUS_OPTIONS, CATEGORY_OPTIONS } from '../types';
import type { TableProps } from 'antd';

interface ParamTableProps {
  data: SysParam[];
  loading: boolean;
  selectedRowKeys: React.Key[];
  onSelectionChange: (selectedRowKeys: React.Key[], selectedRows: SysParam[]) => void;
  onEdit: (record: SysParam) => void;
  onDelete: (record: SysParam) => void;
  onStatusChange: (record: SysParam, checked: boolean) => void;
  pagination?: TableProps<SysParam>['pagination'];
}

const ParamTable: React.FC<ParamTableProps> = ({
  data,
  loading,
  selectedRowKeys,
  onSelectionChange,
  onEdit,
  onDelete,
  onStatusChange,
  pagination,
}) => {
  const getDataTypeLabel = (value: string) => {
    const option = DATA_TYPE_OPTIONS.find(item => item.value === value);
    return option?.label || value;
  };

  const getStatusLabel = (value: number) => {
    const option = STATUS_OPTIONS.find(item => item.value === value);
    return option?.label || value;
  };

  const getCategoryLabel = (value: string) => {
    const option = CATEGORY_OPTIONS.find(item => item.value === value);
    return option?.label || value;
  };

  const columns: TableProps<SysParam>['columns'] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '参数标识',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      ellipsis: true,
    },
    {
      title: '参数内容',
      dataIndex: 'value',
      key: 'value',
      width: 200,
      ellipsis: true,
      render: (value: string) => value || '-',
    },
    {
      title: '参数分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (value: string) => (
        <Tag color="blue">{getCategoryLabel(value)}</Tag>
      ),
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 100,
      render: (value: string) => (
        <Tag color="green">{getDataTypeLabel(value)}</Tag>
      ),
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: 80,
      render: (value: boolean) => (
        <Tag color={value ? 'red' : 'default'}>
          {value ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: number, record: SysParam) => (
        <Switch
          checked={value === 1}
          onChange={(checked) => onStatusChange(record, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (value: string) => {
        if (!value) return '-';
        return new Date(value).toLocaleString('zh-CN');
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_: any, record: SysParam) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-blue-500 hover:text-blue-600"
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              className="text-red-500 hover:text-red-600"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectionChange,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        scroll={{ x: 1200 }}
        className="ant-table-custom"
      />
    </div>
  );
};

export default ParamTable;
