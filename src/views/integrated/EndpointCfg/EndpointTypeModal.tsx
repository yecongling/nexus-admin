import { Button, Form, Input, type InputRef } from 'antd';
import { useEffect, useRef } from 'react';
import DragModal from '@/components/modal/DragModal';

/**
 * 端点类型编辑窗口
 */
const EndpointTypeModal: React.FC<EndpointTypeModalProps> = ({ open, onOk, onCancel, data }) => {
  const [form] = Form.useForm();
  const nameRef = useRef<InputRef>(null);

  useEffect(() => {
    if (!open) return;
    // 首先清空数据
    form.resetFields();
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form, open]);

  /**
   * 点击确认的回调
   */
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  /**
   * 弹窗打开关闭的回调（打开后默认聚焦到名称输入框）
   * @param open 弹窗是否打开
   */
  const onAfterOpenChange = (open: boolean) => {
    if (open) {
      nameRef.current?.focus();
    }
  };

  return (
    <DragModal
      title={data ? '编辑端点类型' : '新增端点类型'}
      width={400}
      open={open}
      onCancel={onCancel}
      afterOpenChange={onAfterOpenChange}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 4 }} onFinish={handleOk}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="parentId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input ref={nameRef} />
        </Form.Item>
        <Form.Item name="icon" label="图标">
          <Input />
        </Form.Item>
        <Form.Item label={null} hidden>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </DragModal>
  );
};
export default EndpointTypeModal;

// 端点类型弹窗的参数
export type EndpointTypeModalProps = {
  // 弹窗可见性
  open: boolean;
  // 点击确定时的回调
  onOk: any;
  // 点击取消时的回调
  onCancel: any;
  // 弹窗需要的数据
  data: Record<string, any> | null;
};
