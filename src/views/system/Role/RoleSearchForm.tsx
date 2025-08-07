import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Card, Col, ConfigProvider, Form, Input, Row, Select, Space } from 'antd';
import type React from 'react';
import { useTranslation } from 'react-i18next';

interface RoleSearchFormProps {
  onFinish: (values: any) => void;
  isLoading: boolean;
}

/**
 * 角色检索表单
 * @param props 参数
 * @returns 检索表单
 */
const RoleSearchForm: React.FC<RoleSearchFormProps> = ({ onFinish, isLoading }) => {
  // 检索表单
  const [form] = Form.useForm();
  const { t } = useTranslation();
  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            itemMarginBottom: 0,
          },
        },
      }}
    >
      <Card>
        <Form initialValues={{ menuType: '', status: '' }} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="roleCode" label="角色编码" colon={false}>
                <Input autoFocus allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="roleName" label="角色名称" colon={false}>
                <Input allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态" colon={false}>
                <Select
                  allowClear
                  options={[
                    { value: '', label: '请选择', disabled: true },
                    { value: 1, label: '正常' },
                    { value: 0, label: '停用' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={isLoading} icon={<SearchOutlined />}>
                  {t('common.operation.search')}
                </Button>
                <Button
                  type="default"
                  icon={<RedoOutlined />}
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  {t('common.operation.reset')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default RoleSearchForm;
