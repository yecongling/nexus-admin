import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

type SearchBarProps = {
  onFinish: (values: any) => void;
};

/**
 * 检索表单
 */
const SearchBar: React.FC<SearchBarProps> = ({ onFinish }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name="name" label="菜单名称" colon={false}>
            <Input autoFocus allowClear autoComplete="off" placeholder="请输入菜单名称" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="menuType" label="菜单类型" colon={false}>
            <Select
              allowClear
              placeholder="请选择菜单类型"
              options={[
                { value: 0, label: '一级菜单' },
                { value: 1, label: '子菜单' },
                { value: 2, label: '按钮权限' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="status" label="状态" colon={false}>
            <Select
              allowClear
              placeholder="请选择状态"
              options={[
                { value: 1, label: '启用' },
                { value: 0, label: '停用' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Space>
            <Button type="default" icon={<RedoOutlined />}>
              {t('common.operation.reset')}
            </Button>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              {t('common.operation.search')}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
