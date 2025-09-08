import type React from 'react';
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox, Button, message, Typography } from 'antd';
import { versionsService } from '@/services/integrated/version/api';
import type { CreateVersionParams, VersionType, WorkflowVersion } from '@/services/integrated/version/model';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface CreateVersionModalProps {
  visible: boolean;
  onClose: () => void;
  workflowId: number;
  currentVersion?: string;
}

const CreateVersionModal: React.FC<CreateVersionModalProps> = ({
  visible,
  onClose,
  workflowId,
  currentVersion = 'v2.1.0',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);

  // 模拟版本数据
  const mockVersions: WorkflowVersion[] = [
    { id: 1, version: 'v2.1.0', versionName: '优化用户体验版本' } as WorkflowVersion,
    { id: 2, version: 'v2.0.0', versionName: '重大功能更新' } as WorkflowVersion,
    { id: 3, version: 'v1.5.2', versionName: 'bug修复版本' } as WorkflowVersion,
  ];

  useEffect(() => {
    if (visible) {
      loadVersions();
      form.resetFields();
      // 设置默认的基于版本
      form.setFieldsValue({
        basedOnVersion: currentVersion,
      });
    }
  }, [visible, currentVersion]);

  const loadVersions = async () => {
    try {
      const result = await versionsService.getVersionList({
        workflowId,
        pageNum: 1,
        pageSize: 100,
      });
      setVersions(result.records || mockVersions);
    } catch (error) {
      // 如果API调用失败，使用模拟数据
      setVersions(mockVersions);
      message.warning('使用模拟数据，API调用失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const params: CreateVersionParams = {
        workflowId,
        versionType: values.versionType,
        versionName: values.versionName,
        description: values.description,
        basedOnVersion: values.basedOnVersion,
        publishImmediately: values.publishImmediately || false,
      };

      await versionsService.createVersion(params);
      message.success('版本创建成功');
      onClose();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error('创建版本失败');
    } finally {
      setLoading(false);
    }
  };

  const getVersionTypeOptions = () => {
    const versionType = form.getFieldValue('versionType');
    const basedOnVersion = form.getFieldValue('basedOnVersion');

    // 根据基础版本自动建议版本类型
    if (basedOnVersion && !versionType) {
      const baseVersion = versions.find((v) => v.version === basedOnVersion);
      if (baseVersion) {
        // 这里可以根据版本号规则自动建议下一个版本类型
        // 简化处理，提供所有选项
      }
    }

    return [
      { value: 'PATCH', label: '补丁版本 (v2.1.1)', description: '修复bug，向后兼容' },
      { value: 'MINOR', label: '次版本 (v2.2.0)', description: '新功能，向后兼容' },
      { value: 'MAJOR', label: '主版本 (v3.0.0)', description: '重大变更，可能不兼容' },
      { value: 'HOTFIX', label: '热修复 (v2.1.1-hotfix)', description: '紧急修复' },
    ];
  };

  const getVersionTypeLabel = (type: VersionType) => {
    switch (type) {
      case 'PATCH':
        return '补丁版本';
      case 'MINOR':
        return '次版本';
      case 'MAJOR':
        return '主版本';
      case 'HOTFIX':
        return '热修复';
      default:
        return type;
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            创建版本
          </Title>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={600}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>
          创建新版本
        </Title>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="versionType" label="版本类型" rules={[{ required: true, message: '请选择版本类型' }]}>
          <Select placeholder="选择版本类型">
            {getVersionTypeOptions().map((option) => (
              <Option key={option.value} value={option.value}>
                <div>
                  <div>{option.label}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{option.description}</div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="versionName"
          label="版本名称"
          rules={[
            { required: true, message: '请输入版本名称' },
            { max: 255, message: '版本名称不能超过255个字符' },
          ]}
        >
          <Input placeholder="输入版本名称..." />
        </Form.Item>

        <Form.Item name="description" label="版本描述" rules={[{ max: 1000, message: '版本描述不能超过1000个字符' }]}>
          <TextArea placeholder="描述本次版本的主要变更..." rows={4} showCount maxLength={1000} />
        </Form.Item>

        <Form.Item name="basedOnVersion" label="基于版本" rules={[{ required: true, message: '请选择基于版本' }]}>
          <Select placeholder="选择基于版本">
            {versions.map((version) => (
              <Option key={version.version} value={version.version}>
                {version.version} {version.versionName && `(${version.versionName})`}
                {version.version === currentVersion && ' (当前版本)'}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="publishImmediately" valuePropName="checked">
          <Checkbox>创建后立即发布</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            创建版本
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVersionModal;
