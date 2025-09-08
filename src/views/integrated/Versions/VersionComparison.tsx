import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Select,
  Typography,
  Row,
  Col,
  Alert,
  Spin,
  message,
} from 'antd';
import DragModal from '@/components/modal/DragModal';
import { versionsService } from '@/services/integrated/version/api';
import type { WorkflowVersion, WorkflowVersionDelta } from '@/services/integrated/version/model';

const { Option } = Select;
const { Title, Text } = Typography;

interface VersionComparisonProps {
  workflowId: number;
  visible: boolean;
  onClose: () => void;
  baseVersion?: string;
  targetVersion?: string;
}

const VersionComparison: React.FC<VersionComparisonProps> = ({
  workflowId,
  visible,
  onClose,
  baseVersion: initialBaseVersion,
  targetVersion: initialTargetVersion,
}) => {
  const [loading, setLoading] = useState(false);
  const [baseVersion, setBaseVersion] = useState<string>(initialBaseVersion || '');
  const [targetVersion, setTargetVersion] = useState<string>(initialTargetVersion || '');
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [deltas, setDeltas] = useState<WorkflowVersionDelta[]>([]);
  const [diffContent, setDiffContent] = useState<string>('');

  // 模拟版本数据
  const mockVersions: WorkflowVersion[] = [
    { id: 1, version: 'v2.0.0', versionName: '重大功能更新' } as WorkflowVersion,
    { id: 2, version: 'v2.1.0', versionName: '优化用户体验版本' } as WorkflowVersion,
    { id: 3, version: 'v1.5.2', versionName: 'bug修复版本' } as WorkflowVersion,
  ];

  // 模拟差异数据
  const mockDeltas: WorkflowVersionDelta[] = [
    {
      id: 1,
      workflowId: 1,
      fromVersion: 'v2.0.0',
      toVersion: 'v2.1.0',
      deltaType: 'MODIFY',
      objectPath: 'nodes[0].name',
      oldValue: '"开始节点"',
      newValue: '"流程开始"',
      createdAt: '2024-03-15T14:30:00Z',
    },
    {
      id: 2,
      workflowId: 1,
      fromVersion: 'v2.0.0',
      toVersion: 'v2.1.0',
      deltaType: 'ADD',
      objectPath: 'nodes[1]',
      oldValue: '',
      newValue: '{"id": "validation_node", "name": "数据验证", "type": "validation"}',
      createdAt: '2024-03-15T14:30:00Z',
    },
    {
      id: 3,
      workflowId: 1,
      fromVersion: 'v2.0.0',
      toVersion: 'v2.1.0',
      deltaType: 'MODIFY',
      objectPath: 'nodes[2].timeout',
      oldValue: '300',
      newValue: '600',
      createdAt: '2024-03-15T14:30:00Z',
    },
  ];

  useEffect(() => {
    if (visible) {
      loadVersions();
    }
  }, [visible]);

  useEffect(() => {
    if (baseVersion && targetVersion && baseVersion !== targetVersion) {
      loadComparison();
    }
  }, [baseVersion, targetVersion]);

  const loadVersions = async () => {
    try {
      const result = await versionsService.getVersionList({ 
        workflowId, 
        pageNum: 1, 
        pageSize: 100 
      });
      setVersions(result.records || mockVersions);
    } catch (error) {
      // 如果API调用失败，使用模拟数据
      setVersions(mockVersions);
      message.warning('使用模拟数据，API调用失败');
    }
  };

  const loadComparison = async () => {
    if (!baseVersion || !targetVersion) return;

    setLoading(true);
    try {
      const params = {
        workflowId,
        baseVersion,
        targetVersion,
      };
      const result = await versionsService.compareVersions(params);
      setDeltas(result.deltas);
      setDiffContent(result.diffContent);
    } catch (error) {
      // 如果API调用失败，使用模拟数据
      setDeltas(mockDeltas);
      setDiffContent(generateMockDiffContent());
      message.warning('使用模拟数据，API调用失败');
    } finally {
      setLoading(false);
    }
  };

  const generateMockDiffContent = () => {
    return `"nodes": [
  { "id": "start_node",
-   "name": "开始节点",
+   "name": "流程开始",
    "type": "start"
  },
+ { "id": "validation_node",
+   "name": "数据验证",
+   "type": "validation"
+ },
  { "id": "process_node",
    "timeout": 300,
-   "timeout": 300,
+   "timeout": 600,
  }`;
  };


  const renderDiffContent = () => {
    if (!diffContent) return null;

    const lines = diffContent.split('\n');
    return (
      <div style={{ 
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        fontSize: '12px',
        lineHeight: '1.5',
        backgroundColor: '#f5f5f5',
        padding: '16px',
        borderRadius: '4px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {lines.map((line, lineIndex) => {
          const isAddition = line.startsWith('+');
          const isDeletion = line.startsWith('-');
          
          return (
            <div
              key={`line-${lineIndex}-${line.substring(0, 20)}`}
              style={{
                backgroundColor: isAddition ? '#f6ffed' : isDeletion ? '#fff2f0' : 'transparent',
                borderLeft: isAddition ? '3px solid #52c41a' : isDeletion ? '3px solid #ff4d4f' : 'none',
                padding: '2px 8px',
                margin: '1px 0',
              }}
            >
              <span style={{ 
                color: isAddition ? '#52c41a' : isDeletion ? '#ff4d4f' : '#666',
                fontWeight: isAddition || isDeletion ? 'bold' : 'normal'
              }}>
                {line}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const getChangeSummary = () => {
    const addCount = deltas.filter(d => d.deltaType === 'ADD').length;
    const modifyCount = deltas.filter(d => d.deltaType === 'MODIFY').length;
    const deleteCount = deltas.filter(d => d.deltaType === 'DELETE').length;
    
    return {
      add: addCount,
      modify: modifyCount,
      delete: deleteCount,
      total: addCount + modifyCount + deleteCount
    };
  };

  if (!visible) return null;

  const summary = getChangeSummary();

  return (
    <DragModal
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ maxWidth: '1200px' }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>版本对比</Title>
        </div>
      }
      footer={null}
    >
      <div style={{ maxHeight: '70vh', overflow: 'auto' }}>

        {/* 版本选择 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Text strong>基础版本：</Text>
            <Select
              value={baseVersion}
              onChange={setBaseVersion}
              style={{ width: '100%', marginTop: 8 }}
              placeholder="选择基础版本"
            >
              {versions.map(version => (
                <Option key={version.version} value={version.version}>
                  {version.version} - {version.versionName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <Text strong>目标版本：</Text>
            <Select
              value={targetVersion}
              onChange={setTargetVersion}
              style={{ width: '100%', marginTop: 8 }}
              placeholder="选择目标版本"
            >
              {versions.map(version => (
                <Option key={version.version} value={version.version}>
                  {version.version} - {version.versionName}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* 变更摘要 */}
        {summary.total > 0 && (
          <Alert
            message={`变更摘要: ${summary.modify}个节点修改, ${summary.add}个节点新增, ${summary.delete}个节点删除`}
            type="info"
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 差异内容 */}
        <Spin spinning={loading}>
          {baseVersion && targetVersion && baseVersion !== targetVersion ? (
            <div>
              <Title level={5}>详细差异</Title>
              {renderDiffContent()}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              请选择要对比的两个版本
            </div>
          )}
        </Spin>
      </div>
    </DragModal>
  );
};

export default VersionComparison;
