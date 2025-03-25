import DragModal from '@/components/modal/DragModal';
import { roleService } from './api/roleApi';
import {
  SearchOutlined,
  RedoOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  type InputRef,
  Row,
  Select,
  Space,
  Table,
  type TableProps,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { UserSearchParams } from './api/type';
import { useQuery } from '@tanstack/react-query';

/**
 * 添加用户弹窗
 * @returns
 */
const AddUser: React.FC<AddUserProps> = ({ open, onOk, onCancel, roleId }) => {
  const [form] = Form.useForm();
  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<any[]>([]);
  const ref = useRef<InputRef>(null);

  // 查询参数（包含分页参数）
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    pageNum: 1,
    pageSize: 20,
  });

  // 查询没分配给当前角色的用户数据
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['sys_role_user_not_in_role', [roleId, searchParams]],
    queryFn: () => roleService.getUserNotInRoleByPage(roleId, searchParams),
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
  }, [open]);

  /**
   * 表单检索
   */
  const onFinish = (values: UserSearchParams) => {
    const search = {
      ...values,
      pageNum: searchParams.pageNum,
      pageSize: searchParams.pageSize,
    };
    // 判断参数是否发生变化
    if (JSON.stringify(search) === JSON.stringify(searchParams)) {
      // 参数没有变化，手动刷新数据
      refetch();
      return;
    }
    setSearchParams((prev) => ({ ...prev, ...search }));
  };

  /**
   * 定义表格的列
   */
  const columns: TableProps['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 120,
      align: 'center',
      hidden: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      align: 'left',
    },
    {
      title: '实名',
      dataIndex: 'realName',
      width: 120,
      align: 'left',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 60,
      align: 'center',
      render: (text) => {
        return text === 1 ? (
          <ManOutlined className="text-blue-400" />
        ) : (
          <WomanOutlined className="text-pink-400" />
        );
      },
    },
  ];

  /**
   * 多行选中的配置
   */
  const rowSelection: TableProps['rowSelection'] = {
    // 行选中的回调
    onChange(_selectedRowKeys, selectedRows) {
      setSelectedRows(selectedRows);
    },
    columnWidth: 32,
    fixed: true,
  };

  /**
   * 分页改变事件
   * @param page 页数
   * @param pageSize 每页数量
   */
  const onPageSizeChange = (page: number, pageSize: number) => {
    setSearchParams({
      ...searchParams,
      pageNum: page,
      pageSize: pageSize,
    });
  };

  /**
   * 点击确定的操作
   */
  const handleOk = () => {
    if (selRows.length === 0) {
      onOk(0);
      return;
    }
    const userIds = selRows.map((item: any) => item.id);
    // 分配用户
    roleService.assignRoleUser(roleId, userIds, 'add').then(() => {
      onOk(selRows.length);
      // 清空选择项
      setSelectedRows([]);
    });
  };

  return (
    <DragModal
      open={open}
      onCancel={onCancel}
      title="添加用户"
      width={{ xl: 800, xxl: 1000 }}
      onOk={handleOk}
    >
      <Card className="mb-2!">
        <Form form={form} onFinish={onFinish}>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item className="mb-0" label="用户名" name="username">
                <Input
                  placeholder="请输入用户名"
                  autoFocus
                  allowClear
                  autoComplete="off"
                  ref={ref}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item className="mb-0" label="真实姓名" name="realName">
                <Input
                  placeholder="请输入真实姓名"
                  allowClear
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item className="mb-0" label="性别">
                <Select
                  allowClear
                  options={[
                    { value: '', label: '请选择', disabled: true },
                    { value: 1, label: '男' },
                    { value: 0, label: '女' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  检索
                </Button>
                <Button
                  type="default"
                  icon={<RedoOutlined />}
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt-2">
        <Table
          size="small"
          title={() => '用户列表'}
          bordered
          rowKey="id"
          loading={isLoading}
          columns={columns}
          pagination={{
            pageSize: searchParams.pageSize,
            current: searchParams.pageNum,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            total: data?.total || 0,
            onChange(page, pageSize) {
              onPageSizeChange(page, pageSize);
            },
          }}
          dataSource={data?.tableData || []}
          rowSelection={rowSelection}
        />
      </Card>
    </DragModal>
  );
};
export default AddUser;

export interface AddUserProps {
  open: boolean;
  // 当前角色
  roleId: string;
  // 点击确定(选中的数量)
  onOk: (params: number) => void;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
