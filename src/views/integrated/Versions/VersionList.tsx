import type React from 'react';
import { useState, useMemo } from 'react';
import {
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Modal,
  Pagination,
  theme,
  Spin,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  SwapOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { type WorkflowVersion, VersionStatus, type VersionType } from '@/services/integrated/version/model';
import {
  useVersionList,
  useDeleteVersion,
  usePublishVersion,
  useRollbackVersion,
} from '@/views/integrated/Versions/useVersionQueries';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const { useToken } = theme;

interface VersionListProps {
  workflowId: string;
  onViewVersion?: (version: WorkflowVersion) => void;
  onCompareVersion?: (version: WorkflowVersion) => void;
  onDownloadVersion?: (version: WorkflowVersion) => void;
  onEditVersion?: (version: WorkflowVersion) => void;
  onDeleteVersion?: (version: WorkflowVersion) => void;
  onPublishVersion?: (version: WorkflowVersion) => void;
  onRollbackVersion?: (version: WorkflowVersion) => void;
  onCreateVersion?: () => void;
}

/**
 * 版本列表
 * @param props
 * @param props.workflowId 工作流ID
 * @param props.onViewVersion 查看版本
 * @param props.onCompareVersion 对比版本
 * @param props.onDownloadVersion 下载版本
 * @param props.onEditVersion 编辑版本
 * @param props.onDeleteVersion 删除版本
 * @param props.onPublishVersion 发布版本
 * @param props.onRollbackVersion 回滚版本
 * @param props.onCreateVersion 创建版本
 * @returns 版本列表
 */
const VersionList: React.FC<VersionListProps> = ({
  workflowId,
  onViewVersion,
  onCompareVersion,
  onDownloadVersion,
  onEditVersion,
  onDeleteVersion,
  onPublishVersion,
  onRollbackVersion,
  onCreateVersion,
}) => {
  const { token } = useToken();

  // 搜索和筛选状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [branchFilter, setBranchFilter] = useState<string | undefined>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 构建查询参数
  const queryParams = useMemo(
    () => ({
      workflowId,
      keyword: searchKeyword,
      status: statusFilter,
      branch: branchFilter,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }),
    [workflowId, searchKeyword, statusFilter, branchFilter, pagination.current, pagination.pageSize],
  );

  // 使用 React Query 获取版本列表
  const { data: versionResult, isLoading, error } = useVersionList(queryParams);

  // 版本数据和分页信息
  const versions = versionResult?.records || [];
  const total = versionResult?.totalRow || 0;

  // 更新分页总数
  useMemo(() => {
    setPagination((prev) => ({
      ...prev,
      total,
    }));
  }, [total]);

  // Mutations
  const deleteVersionMutation = useDeleteVersion();
  const publishVersionMutation = usePublishVersion();
  const rollbackVersionMutation = useRollbackVersion();

  const getStatusInfo = (status: number) => {
    switch (status) {
      case VersionStatus.DRAFT:
        return { text: '草稿', color: 'orange', icon: <ClockCircleOutlined /> };
      case VersionStatus.PUBLISHED:
        return { text: '已发布', color: 'green', icon: <CheckCircleOutlined /> };
      case VersionStatus.DEPRECATED:
        return { text: '已弃用', color: 'red', icon: <ExclamationCircleOutlined /> };
      case VersionStatus.ARCHIVED:
        return { text: '已归档', color: 'gray', icon: <ExclamationCircleOutlined /> };
      default:
        return { text: '未知', color: 'default', icon: null };
    }
  };

  const getVersionTypeText = (type: VersionType) => {
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

  const handleDelete = (version: WorkflowVersion) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除版本 ${version.version} 吗？此操作不可撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        deleteVersionMutation.mutate({
          workflowId,
          versionId: version.id,
        });
        onDeleteVersion?.(version);
      },
    });
  };

  const handlePublish = (version: WorkflowVersion) => {
    publishVersionMutation.mutate({
      workflowId,
      versionId: version.id,
    });
    onPublishVersion?.(version);
  };

  const handleRollback = (version: WorkflowVersion) => {
    rollbackVersionMutation.mutate({
      workflowId,
      versionId: version.id,
    });
    onRollbackVersion?.(version);
  };

  // 分页变化处理
  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPagination((prev) => ({
      ...prev,
      current: 1, // 搜索时重置到第一页
    }));
  };

  const renderActionButtons = (version: WorkflowVersion) => {
    const buttons = [];
    const status = version.status;

    // 查看按钮 - 所有版本都有
    buttons.push(
      <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => onViewVersion?.(version)}>
        查看
      </Button>,
    );

    // 根据状态显示不同按钮
    if (status === VersionStatus.DRAFT) {
      // 草稿状态：编辑、发布、删除
      buttons.push(
        <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => onEditVersion?.(version)}>
          编辑
        </Button>,
        <Button
          key="publish"
          type="primary"
          icon={<CloudUploadOutlined />}
          loading={publishVersionMutation.isPending}
          onClick={() => handlePublish(version)}
        >
          发布
        </Button>,
        <Button
          key="delete"
          type="text"
          danger
          icon={<DeleteOutlined />}
          loading={deleteVersionMutation.isPending}
          onClick={() => handleDelete(version)}
        >
          删除
        </Button>,
      );
    } else if (status === VersionStatus.PUBLISHED) {
      // 已发布状态：回滚、对比、下载
      buttons.push(
        <Button
          key="rollback"
          type="primary"
          icon={<SwapOutlined />}
          loading={rollbackVersionMutation.isPending}
          onClick={() => handleRollback(version)}
        >
          回滚
        </Button>,
        <Button key="compare" type="text" icon={<SwapOutlined />} onClick={() => onCompareVersion?.(version)}>
          对比
        </Button>,
        <Button key="download" type="text" icon={<DownloadOutlined />} onClick={() => onDownloadVersion?.(version)}>
          下载
        </Button>,
      );
    } else {
      // 其他状态：对比、下载
      buttons.push(
        <Button key="compare" type="text" icon={<SwapOutlined />} onClick={() => onCompareVersion?.(version)}>
          对比
        </Button>,
        <Button key="download" type="text" icon={<DownloadOutlined />} onClick={() => onDownloadVersion?.(version)}>
          下载
        </Button>,
      );
    }

    return <Space>{buttons}</Space>;
  };

  // 错误处理
  if (error) {
    return (
      <div className="h-full flex flex-col box-border">
        <Card className="mb-4! flex-shrink-0">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">数据加载失败</div>
            <Button onClick={() => window.location.reload()}>重新加载</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col box-border">
      {/* 搜索和筛选区域 */}
      <Card className="mb-4! flex-shrink-0">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索版本..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col>
            <Select
              placeholder="全部状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120, marginRight: 8 }}
              allowClear
            >
              <Option value={VersionStatus.DRAFT}>草稿</Option>
              <Option value={VersionStatus.PUBLISHED}>已发布</Option>
              <Option value={VersionStatus.DEPRECATED}>已弃用</Option>
              <Option value={VersionStatus.ARCHIVED}>已归档</Option>
            </Select>
            <Select
              placeholder="全部分支"
              value={branchFilter}
              onChange={setBranchFilter}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="master">主分支</Option>
              <Option value="feature">功能分支</Option>
              <Option value="hotfix">热修复分支</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreateVersion}>
              创建新版本
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 版本列表区域 - 占据剩余空间并支持滚动 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            paddingRight: '8px', // 为滚动条留出空间
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {versions.length > 0 ? (
                versions.map((version) => {
                  const statusInfo = getStatusInfo(version.status);
                  const isCurrentVersion = version.status === VersionStatus.PUBLISHED && version.version === 'v2.1.0';

                  return (
                    <Card
                      key={version.id}
                      hoverable
                      style={{
                        border: isCurrentVersion ? `2px solid ${token.colorPrimary}` : undefined,
                        position: 'relative',
                      }}
                    >
                      <Row gutter={16} align="middle">
                        <Col flex="none">
                          <Tag color={version.versionType === 'MAJOR' ? 'blue' : 'green'}>{version.version}</Tag>
                        </Col>
                        <Col flex="auto">
                          <div>
                            <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                              {version.versionName}
                              {isCurrentVersion && (
                                <Tag color="green" style={{ marginLeft: 8 }}>
                                  当前版本
                                </Tag>
                              )}
                            </Title>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: statusInfo.color }}>{statusInfo.icon}</span>
                                <Text type="secondary">{statusInfo.text}</Text>
                              </div>
                              <Text type="secondary">{getVersionTypeText(version.versionType as any)}</Text>
                              <Text type="secondary">创建人：张三</Text>
                              <Text type="secondary">{formatDate(version.createTime)}</Text>
                              <Text type="secondary">{formatFileSize(version.fileSize)}</Text>
                            </div>
                          </div>
                        </Col>
                        <Col flex="none">{renderActionButtons(version)}</Col>
                      </Row>
                    </Card>
                  );
                })
              ) : (
                <Empty description="暂无版本数据">
                  <Button type="primary" onClick={onCreateVersion}>
                    创建新版本
                  </Button>
                </Empty>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 分页组件 - 固定在底部 */}
      <Pagination
        className="flex-shrink-0 flex justify-center p-4 bg-bg-container mt-4!  "
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        onShowSizeChange={handlePageChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
        pageSizeOptions={['10', '20', '50', '100']}
      />
    </div>
  );
};

export default VersionList;
