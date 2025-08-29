import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, message } from 'antd';
import type { SysParam, SysParamFormData } from '../types';
import { DATA_TYPE_OPTIONS, STATUS_OPTIONS, CATEGORY_OPTIONS } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface ParamModalProps {
  open: boolean;
  title: string;
  loading: boolean;
  initialValues?: Partial<SysParam>;
  onOk: (values: SysParamFormData) => void;
  onCancel: () => void;
}

const ParamModal: React.FC<ParamModalProps> = ({
  open,
  title,
  loading,
  initialValues,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      // 表单验证失败
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleDataTypeChange = (value: string) => {
    // 根据数据类型清空相关字段
    if (value === 'NUMBER') {
      form.setFieldsValue({ value: '', validatationRule: '' });
    } else if (value === 'BOOLEAN') {
      form.setFieldsValue({ value: 'false', validatationRule: '' });
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
      className="param-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          category: 'SYSTEM',
          dataType: 'STRING',
          required: false,
          status: 1,
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label="参数分类"
            rules={[{ required: true, message: '请选择参数分类' }]}
          >
            <Select
              placeholder="请选择参数分类"
              options={CATEGORY_OPTIONS}
            />
          </Form.Item>

          <Form.Item
            name="dataType"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select
              placeholder="请选择数据类型"
              options={DATA_TYPE_OPTIONS}
              onChange={handleDataTypeChange}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="code"
            label="参数标识"
            rules={[
              { required: true, message: '请输入参数标识' },
              { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '参数标识只能包含字母、数字和下划线，且必须以字母开头' },
            ]}
          >
            <Input placeholder="请输入参数标识" />
          </Form.Item>

          <Form.Item
            name="name"
            label="参数名称"
            rules={[{ required: true, message: '请输入参数名称' }]}
          >
            <Input placeholder="请输入参数名称" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="参数描述"
        >
          <TextArea
            placeholder="请输入参数描述"
            rows={2}
            maxLength={255}
            showCount
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="defaultValue"
            label="默认值"
          >
            <Input placeholder="请输入默认值" />
          </Form.Item>

          <Form.Item
            name="value"
            label="参数值"
            rules={[{ required: true, message: '请输入参数值' }]}
          >
            <Input placeholder="请输入参数值" />
          </Form.Item>
        </div>

        <Form.Item
          name="validatationRule"
          label="验证规则"
        >
          <Input placeholder="请输入验证规则" />
        </Form.Item>

        <Form.Item
          name="relatedParam"
          label="关联参数"
        >
          <Input placeholder="请输入关联参数" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="required"
            label="是否必填"
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              placeholder="请选择状态"
              options={STATUS_OPTIONS}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ParamModal;
