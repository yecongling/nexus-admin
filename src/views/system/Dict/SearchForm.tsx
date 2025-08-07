import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { Form, ConfigProvider, Card, Row, Col, Input, Space, Button } from 'antd';
import type { DictSearchParams } from '@/services/system/dict/type';
import { useTranslation } from 'react-i18next';

// 搜索表单属性
interface SearchFormProps {
  onSearch: (values: DictSearchParams) => void;
}

// 数据字典检索表单
const DictSearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  /**
   * 重置
   */
  const handleReset = () => {
    form.resetFields();
    onSearch(form.getFieldsValue());
  };

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
        <Form form={form} onFinish={onSearch}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="dictName" label="字典名称" colon={false}>
                <Input autoFocus allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dictCode" label="字典编码" colon={false}>
                <Input allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  {t('common.operation.search')}
                </Button>
                <Button type="default" icon={<RedoOutlined />} onClick={handleReset}>
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
export default DictSearchForm;
