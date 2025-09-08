import React, { useState, useEffect } from 'react';
import {
  Card,
  Alert,
  Typography,
  List,
  Button,
  message,
  Spin,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { versionsService } from '@/services/integrated/version/api';
import type { WorkflowVersion, PublishVersionParams } from '@/services/integrated/version/model';

const { Title, Text } = Typography;

interface ReleaseConfirmationProps {
  visible: boolean;
  onClose: () => void;
  version: WorkflowVersion | null;
}

const ReleaseConfirmation: React.FC<ReleaseConfirmationProps> = ({
  visible,
  onClose,
  version,
}) => {
  const [loading, setLoading] = useState(false);
  const [impactAssessment, setImpactAssessment] = useState<{
    backwardCompatible: boolean;
    nonDestructive: boolean;
    requiresRedeployment: boolean;
  }>({
    backwardCompatible: true,
    nonDestructive: true,
    requiresRedeployment: true,
  });

  useEffect(() => {
    if (visible && version) {
      loadImpactAssessment();
    }
  }, [visible, version]);

  const loadImpactAssessment = async () => {
    if (!version) return;

    setLoading(true);
    try {
      const result = await versionsService.assessVersionImpact(version.workflowId, version.id);
      setImpactAssessment(result);
    } catch (error) {
      // 如果API调用失败，使用模拟数据
      setImpactAssessment({
        backwardCompatible: true,
        nonDestructive: true,
        requiresRedeployment: true,
      });
      message.warning('使用模拟数据，API调用失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!version) return;

    setLoading(true);
    try {
      const params: PublishVersionParams = {
        workflowId: version.workflowId,
        version: version.version,
        publishNote: `发布版本 ${version.version}`,
      };

      await versionsService.publishVersion(params);
      message.success('版本发布成功');
      onClose();
    } catch (error) {
      message.error('版本发布失败');
    } finally {
      setLoading(false);
    }
  };

  const getVersionTypeText = (type: string) => {
    switch (type) {
      case 'MAJOR':
        return '主版本';
      case 'MINOR':
        return '次版本';
      case 'PATCH':
        return '补丁版本';
      case 'HOTFIX':
        return '热修复';
      default:
        return type;
    }
  };

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case 'MAJOR':
        return 'red';
      case 'MINOR':
        return 'blue';
      case 'PATCH':
        return 'green';
      case 'HOTFIX':
        return 'orange';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (!visible || !version) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>版本发布确认页面</Title>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
            />
          </div>
        }
      >
        <Spin spinning={loading}>
          <div style={{ marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>版本发布确认</Title>
          </div>

          {/* 警告信息 */}
          <Alert
            message="注意: 发布后的版本将不能再次编辑, 请确认所有内容无误。"
            type="warning"
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          {/* 版本信息 */}
          <Card size="small" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>版本号：</Text>
                <div>
                  <Tag color={getVersionTypeColor(version.versionType)}>
                    {version.version}
                  </Tag>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>版本名称：</Text>
                <div>{version.versionName || '-'}</div>
              </Col>
              <Col span={8}>
                <Text strong>基于版本：</Text>
                <div>{version.basedOnVersion || '-'}</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Text strong>版本类型：</Text>
                <div>{getVersionTypeText(version.versionType)}</div>
              </Col>
              <Col span={8}>
                <Text strong>文件大小：</Text>
                <div>{formatFileSize(version.fileSize)}</div>
              </Col>
              <Col span={8}>
                <Text strong>创建时间：</Text>
                <div>{formatDate(version.createTime)}</div>
              </Col>
            </Row>
          </Card>

          {/* 主要变更 */}
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>主要变更：</Title>
            <List
              size="small"
              dataSource={[
                '新增3个自动化节点',
                '优化审批流程逻辑',
                '修复已知bug 5个',
                '改进用户界面交互',
                '增强系统性能',
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Text>• {item}</Text>
                </List.Item>
              )}
            />
          </div>

          {/* 影响评估 */}
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>影响评估：</Title>
            <List
              size="small"
              dataSource={[
                {
                  key: 'backwardCompatible',
                  label: '向下兼容',
                  value: impactAssessment.backwardCompatible,
                  icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                },
                {
                  key: 'nonDestructive',
                  label: '无破坏性变更',
                  value: impactAssessment.nonDestructive,
                  icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                },
                {
                  key: 'requiresRedeployment',
                  label: '需要重新部署',
                  value: impactAssessment.requiresRedeployment,
                  icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.icon}
                    <Text>{item.label}</Text>
                  </div>
                </List.Item>
              )}
            />
          </div>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center' }}>
            <Button onClick={onClose} style={{ marginRight: 16 }}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              loading={loading}
            >
              确认发布
            </Button>
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default ReleaseConfirmation;
