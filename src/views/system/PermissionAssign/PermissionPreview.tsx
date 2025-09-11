import type React from 'react';
import PermissionPreview from './components/PermissionPreview';

/**
 * 权限预览组件包装器
 * 展示角色的完整权限信息
 */
const PermissionPreviewWrapper: React.FC = () => {
  return <PermissionPreview />;
};

export default PermissionPreviewWrapper;
