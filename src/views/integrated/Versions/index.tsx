import type React from 'react';
import { useState } from 'react';
import { message } from 'antd';
import VersionList from './VersionList';
import VersionComparison from './VersionComparison';
import CreateVersionModal from './CreateVersionModal';
import ReleaseConfirmation from './ReleaseConfirmation';
import { versionsService } from '@/services/integrated/version/api';
import type { WorkflowVersion } from '@/services/integrated/version/model';

/**
 * 版本管理主组件
 */
const Versions: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReleaseConfirmation, setShowReleaseConfirmation] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<WorkflowVersion | null>(null);
  const [comparisonVersions, setComparisonVersions] = useState<{
    baseVersion?: string;
    targetVersion?: string;
  }>({});

  // 模拟工作流ID，实际应该从路由参数或props获取
  const workflowId = 1;

  // 查看版本详情
  const handleViewVersion = (version: WorkflowVersion) => {
    // TODO: 实现查看版本详情逻辑
    console.log('查看版本:', version);
    message.info(`查看版本 ${version.version}`);
  };

  // 版本对比
  const handleCompareVersion = (version: WorkflowVersion) => {
    setComparisonVersions({
      baseVersion: version.version,
      targetVersion: undefined,
    });
    setShowComparison(true);
  };

  // 下载版本
  const handleDownloadVersion = (version: WorkflowVersion) => {
    // TODO: 实现下载版本逻辑
    console.log('下载版本:', version);
    message.info(`下载版本 ${version.version}`);
  };

  // 编辑版本
  const handleEditVersion = (version: WorkflowVersion) => {
    // TODO: 实现编辑版本逻辑
    console.log('编辑版本:', version);
    message.info(`编辑版本 ${version.version}`);
  };

  // 删除版本
  const handleDeleteVersion = async (version: WorkflowVersion) => {
    try {
      await versionsService.deleteVersion(workflowId, version.id);
      message.success(`版本 ${version.version} 删除成功`);
    } catch (error) {
      message.error('删除版本失败');
    }
  };

  // 发布版本
  const handlePublishVersion = (version: WorkflowVersion) => {
    setSelectedVersion(version);
    setShowReleaseConfirmation(true);
  };

  // 回滚版本
  const handleRollbackVersion = (version: WorkflowVersion) => {
    // TODO: 实现回滚版本逻辑
    console.log('回滚版本:', version);
    message.info(`回滚到版本 ${version.version}`);
  };

  // 创建版本
  const handleCreateVersion = () => {
    setShowCreateModal(true);
  };


  // 关闭版本对比
  const handleCloseComparison = () => {
    setShowComparison(false);
    setComparisonVersions({});
  };

  // 关闭创建版本弹窗
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  // 关闭发布确认弹窗
  const handleCloseReleaseConfirmation = () => {
    setShowReleaseConfirmation(false);
    setSelectedVersion(null);
  };

  return (
    <div>
      <VersionList
        workflowId={workflowId}
        onViewVersion={handleViewVersion}
        onCompareVersion={handleCompareVersion}
        onDownloadVersion={handleDownloadVersion}
        onEditVersion={handleEditVersion}
        onDeleteVersion={handleDeleteVersion}
        onPublishVersion={handlePublishVersion}
        onRollbackVersion={handleRollbackVersion}
        onCreateVersion={handleCreateVersion}
      />

      <VersionComparison
        workflowId={workflowId}
        visible={showComparison}
        onClose={handleCloseComparison}
        baseVersion={comparisonVersions.baseVersion}
        targetVersion={comparisonVersions.targetVersion}
      />

      <CreateVersionModal
        visible={showCreateModal}
        onClose={handleCloseCreateModal}
        workflowId={workflowId}
        currentVersion="v2.1.0"
      />

      <ReleaseConfirmation
        visible={showReleaseConfirmation}
        onClose={handleCloseReleaseConfirmation}
        version={selectedVersion}
      />
    </div>
  );
};

export default Versions;
